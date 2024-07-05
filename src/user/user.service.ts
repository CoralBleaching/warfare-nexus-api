import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common'
import { RelationshipStatus, Prisma as PrismaPostgres } from '.prisma/postgres-client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUserDto } from './dtos/update.user.dto'
import { handleError } from 'src/utils/functions'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private sortUserIds(requester: number, target: number) {
    const ret = {
      user1Id: Math.min(requester, target),
      user2Id: Math.max(requester, target),
    }
    return { ...ret, requestedByUser1: requester === ret.user1Id }
  }

  private updateRelationship(user1Id: number, user2Id: number, status: RelationshipStatus) {
    return this.prisma.postgres.relationship.update({
      where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
      data: { status: status },
    })
  }

  async sendFriendRequest(userId: number, friendId: number) {
    const user = await this.prisma.postgres.user.findUnique({ where: { id: userId } })
    const friend = await this.prisma.postgres.user.findUnique({ where: { id: friendId } })
    if (!user || !friend) {
      throw new NotFoundException('User not found')
    }
    const { user1Id, user2Id, requestedByUser1 } = this.sortUserIds(userId, friendId)
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
    })
    const newStatus = requestedByUser1
      ? RelationshipStatus.USER_2_PENDING
      : RelationshipStatus.USER_1_PENDING
    if (!relationship) {
      // TODO: notify the friend!
      return this.prisma.postgres.relationship.create({
        data: {
          user1: { connect: { id: user1Id } },
          user2: { connect: { id: user2Id } },
          status: newStatus,
        },
      })
    }
    // TODO: notify the friend!
    switch (relationship.status) {
      case RelationshipStatus.FRIENDS:
        throw new NotAcceptableException(`User ${friend.username} is already friends`)
      case RelationshipStatus.USER_1_PENDING:
        if (requestedByUser1) {
          return this.updateRelationship(user1Id, user2Id, RelationshipStatus.FRIENDS)
        }
        throw new ForbiddenException(`Friend request already in place`)
      case RelationshipStatus.USER_2_PENDING:
        if (requestedByUser1) {
          throw new ForbiddenException(`Friend request already in place`)
        }
        return this.updateRelationship(user1Id, user2Id, RelationshipStatus.FRIENDS)
      case RelationshipStatus.USER_1_BLOCKED:
      case RelationshipStatus.USER_2_BLOCKED:
      case RelationshipStatus.BOTH_BLOCKED:
        throw new BadRequestException()
    }
  }

  async respondToFriendRequest(userId: number, friendId: number, accepted: boolean) {
    const { user1Id, user2Id, requestedByUser1 } = this.sortUserIds(userId, friendId)
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
    })
    const currentStatus = requestedByUser1
      ? RelationshipStatus.USER_2_PENDING
      : RelationshipStatus.USER_1_PENDING
    if (!relationship || relationship.status !== currentStatus) {
      throw new NotFoundException('Friend request not found')
    }
    if (accepted) {
      // TODO: notify the friend!
      return this.updateRelationship(user1Id, user2Id, RelationshipStatus.FRIENDS)
    }
    // TODO: notify the friend?
    return this.prisma.postgres.relationship.delete({
      where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
    })
  }

  async blockUser(userId: number, blockedId: number) {
    const { user1Id, user2Id, requestedByUser1 } = this.sortUserIds(userId, blockedId)
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
    })
    const newStatus = requestedByUser1
      ? RelationshipStatus.USER_2_BLOCKED
      : RelationshipStatus.USER_1_BLOCKED
    if (!relationship) {
      return this.prisma.postgres.relationship.upsert({
        where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } },
        update: { status: newStatus },
        create: {
          user1: { connect: { id: user1Id } },
          user2: { connect: { id: user2Id } },
          status: newStatus,
        },
      })
    }
    switch (relationship.status) {
      case RelationshipStatus.USER_1_PENDING:
      case RelationshipStatus.USER_2_PENDING:
      case RelationshipStatus.FRIENDS:
        return this.updateRelationship(user1Id, user2Id, newStatus)
      case RelationshipStatus.USER_1_BLOCKED:
        if (!requestedByUser1) {
          throw new BadRequestException('User already blocked')
        }
        return this.updateRelationship(user1Id, user2Id, RelationshipStatus.BOTH_BLOCKED)
      case RelationshipStatus.USER_2_BLOCKED:
        if (requestedByUser1) {
          throw new BadRequestException('User already blocked')
        }
        return this.updateRelationship(user1Id, user2Id, RelationshipStatus.BOTH_BLOCKED)
      case RelationshipStatus.BOTH_BLOCKED:
        throw new BadRequestException('User already blocked')
    }
  }

  async unblockUser(userId: number, blockedId: number) {
    const { user1Id, user2Id, requestedByUser1 } = this.sortUserIds(userId, blockedId)
    const condition = { where: { user1Id_user2Id: { user1Id: user1Id, user2Id: user2Id } } }
    const relationship = await this.prisma.postgres.relationship.findUnique(condition)
    if (!relationship) {
      throw new BadRequestException('No existing relationship to unblock')
    }
    switch (relationship.status) {
      case RelationshipStatus.USER_1_BLOCKED:
        if (requestedByUser1) {
          throw new BadRequestException('User is not blocked')
        }
        return this.prisma.postgres.relationship.delete(condition)
      case RelationshipStatus.USER_2_BLOCKED:
        if (!requestedByUser1) {
          throw new BadRequestException('User is not blocked')
        }
        return this.prisma.postgres.relationship.delete(condition)
      case RelationshipStatus.BOTH_BLOCKED:
        const newStatus = requestedByUser1
          ? RelationshipStatus.USER_1_BLOCKED
          : RelationshipStatus.USER_2_BLOCKED
        return this.updateRelationship(user1Id, user2Id, newStatus)
      default:
        throw new BadRequestException('User is not blocked')
    }
  }

  async updateUser(userId: number, data: Partial<UpdateUserDto>) {
    return this.prisma.postgres.user
      .update({ where: { id: userId }, data })
      .catch((err) => handleError(err, 'Username or email already registered'))
  }
}
