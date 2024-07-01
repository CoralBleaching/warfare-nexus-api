import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { MatchService } from './match.service'
import { Prisma as PrismaPostgres, User } from '.prisma/postgres-client'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { Request } from 'express'

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create-single')
  async createSingle(@Req() req: Request, @Body() matchData: PrismaPostgres.MatchCreateInput) {
    const user = req.user as User
    if (matchData.user1.connect.id !== user.id) {
      throw new ForbiddenException(`Current user ${user.username} can't create this match`)
    }
    if (matchData.user2) {
      throw new BadRequestException('User2 should be null for creating a match against AI')
    }
    return this.matchService.createSingle(matchData)
  }

  @Post('invite/:userId/:friendId')
  inviteToMatch(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
    @Body('map') map: string,
  ) {
    const user = req.user as User
    if (userId !== user.id) {
      throw new ForbiddenException(`Current user: ${user.username} can't create this match`)
    }
    return this.matchService.inviteToMatch(userId, friendId, map)
  }

  @Post('respond-to-invitation/:matchId/:userId')
  respondToInvitation(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
    @Body('accepted') accepted: boolean,
  ) {
    return this.matchService.respondToInvitation(matchId, userId, accepted)
  }

  @Post('create-open')
  async createOpenMatch(@Req() req: Request, @Body('map') map: string) {
    const user = req.user as User
    return this.matchService.createOpenMatch(user.id, map)
  }

  @Post('accept-open/:matchId')
  async joinOpenMatch(@Req() req: Request, @Param('matchId') matchId: number) {
    const user = req.user as User
    return this.matchService.joinOpenMatch(matchId, user.id)
  }
}
