import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { Request } from 'express'
import { User } from '.prisma/postgres-client'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('send-friend-request/:userId/:friendId')
  sendFriendRequest(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
  ) {
    const user = req.user as User
    if (user.id !== userId) {
      throw new UnauthorizedException('Wrong credentials.')
    }
    return this.userService.sendFriendRequest(userId, friendId)
  }

  @Post('respond-to-friend-request/:userId/:friendId')
  respondToFriendRequest(
    @Req() req: Request,
    @Param('userId') responderId: number,
    @Param('friendId') requesterId: number,
    @Body('accepted') accepted: boolean,
  ) {
    const responder = req.user as User
    if (responder.id !== responderId) {
      throw new UnauthorizedException('Wrong credentials.')
    }
    return this.userService.respondToFriendRequest(responderId, requesterId, accepted)
  }

  @Post('block-user/:userId/:blockId')
  blockUser(
    @Req() req: Request,
    @Param('userId') userId: number,
    @Param('blockId') blockId: number,
  ) {
    const user = req.user as User
    if (user.id !== userId) {
      throw new UnauthorizedException('Wrong credentials.')
    }
    return this.userService.blockUser(userId, blockId)
  }
}
