import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma as PrismaPostgres, RelationshipStatus, MatchStatus } from '.prisma/postgres-client'

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createSingle(match: PrismaPostgres.MatchCreateInput) {
    return this.prisma.postgres.match.create({ data: match })
  }

  async inviteToMatch(user1Id: number, user2Id: number, map: string) {
    const relationship = await this.prisma.postgres.relationship.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: user1Id,
          user2Id: user2Id,
        },
      },
      select: { status: true },
    })
    if (!relationship || relationship.status !== RelationshipStatus.FRIEND) {
      throw new BadRequestException('You can only invite friends to a match')
    }
    // TODO: notify invitee
    return this.prisma.postgres.match.create({
      data: {
        user1: { connect: { id: user1Id } },
        user2: { connect: { id: user2Id } },
        map: map,
        status: MatchStatus.PENDING,
      },
    })
  }

  async respondToInvitation(matchId: number, userId: number, accepted: boolean) {
    const match = await this.prisma.postgres.match.findUnique({
      where: { id: matchId },
    })
    if (!match || match.user2Id !== userId || match.status !== MatchStatus.PENDING) {
      throw new NotFoundException('Invitation not found')
    }
    // TODO: notify inviter
    return this.prisma.postgres.match.update({
      where: { id: matchId },
      data: { status: accepted ? MatchStatus.ACCEPTED : MatchStatus.REJECTED },
    })
  }

  async createOpenMatch(userId: number, map: string) {
    return this.prisma.postgres.match.create({
      data: {
        user1: { connect: { id: userId } },
        user2: null,
        map: map,
        status: MatchStatus.PENDING,
      },
    })
  }

  async joinOpenMatch(matchId: number, userId: number) {
    const match = await this.prisma.postgres.match.findUnique({
      where: { id: matchId },
    })
    if (!match || match.user2Id != null || match.status !== MatchStatus.PENDING) {
      throw new NotFoundException('Open match not found or already joined')
    }
    // TODO: notify user1
    return this.prisma.postgres.match.update({
      where: { id: matchId },
      data: {
        user2: { connect: { id: userId } },
        status: MatchStatus.ACCEPTED,
      },
    })
  }
}
