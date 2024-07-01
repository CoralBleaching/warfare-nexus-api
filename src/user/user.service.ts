import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { RelationshipStatus } from '.prisma/postgres-client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async sendFriendRequest(userId: number, friendId: number) {
    const user = await this.prisma.postgres.user.findUnique({ where: { id: userId } })
    const friend = await this.prisma.postgres.user.findUnique({ where: { id: friendId } })
    if (!user || !friend) {
      throw new NotFoundException('User not found')
    }
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: { user1Id_user2Id: { user1Id: friend.id, user2Id: user.id } },
    })
    if (relationship && relationship.status === RelationshipStatus.BLOCKED) {
      throw new ForbiddenException(`User ${friend.username} has blocked you`)
    }
    // TODO: notify the friend!
    return this.prisma.postgres.relationship.create({
      data: {
        user1: { connect: { id: userId } },
        user2: { connect: { id: friendId } },
        status: RelationshipStatus.PENDING,
      },
    })
  }

  async respondToFriendRequest(responderId: number, requesterId: number, accepted: boolean) {
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: { user1Id_user2Id: { user1Id: requesterId, user2Id: responderId } },
    })
    if (!relationship || relationship.status !== RelationshipStatus.PENDING) {
      throw new NotFoundException('Friend request not found')
    }
    if (accepted) {
      // TODO: notify the requester!
      return this.prisma.postgres.relationship.update({
        where: { user1Id_user2Id: { user1Id: requesterId, user2Id: responderId } },
        data: { status: RelationshipStatus.FRIEND },
      })
    }
    // TODO: notify the requester!
    return this.prisma.postgres.relationship.delete({
      where: { user1Id_user2Id: { user1Id: requesterId, user2Id: responderId } },
    })
  }

  async blockUser(userId: number, blockId: number) {
    return this.prisma.postgres.relationship.upsert({
      where: { user1Id_user2Id: { user1Id: userId, user2Id: blockId } },
      update: { status: RelationshipStatus.BLOCKED },
      create: {
        user1: { connect: { id: userId } },
        user2: { connect: { id: blockId } },
        status: RelationshipStatus.BLOCKED,
      },
    })
  }
}
