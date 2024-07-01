import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { MatchService } from './match.service'
import { Prisma as PrismaPostgres, User } from '.prisma/postgres-client'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { Request } from 'express'

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-single')
  async createSingle(@Req() req: Request, @Body() matchData: PrismaPostgres.MatchCreateInput) {
    const user = req.user as User
    if (matchData.user1.connect.id !== user.id) {
      throw new ForbiddenException(`User ${user.username} can't create this match`)
    }
    if (matchData.user2) {
      throw new BadRequestException('User2 should be null for creating a match against AI')
    }
    return this.matchService.createSingle(matchData)
  }
}
