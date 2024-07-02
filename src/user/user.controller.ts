import {
  Body,
  Controller,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'
import { Request } from 'express'
import { User } from '.prisma/postgres-client'
import { UpdateUserDto } from './dtos/update.user.dto'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('send-friend-request/:userId/:friendId')
  sendFriendRequest(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.sendFriendRequest(userId, friendId)
  }

  @Post('respond-to-friend-request/:userId/:friendId')
  respondToFriendRequest(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
    @Body('accepted', ParseBoolPipe) accepted: boolean,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.respondToFriendRequest(userId, friendId, accepted)
  }

  @Post('block-user/:userId/:blockId')
  blockUser(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('blockId', ParseIntPipe) blockId: number,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.blockUser(userId, blockId)
  }

  @Post('unblock-user/:userId/:blockId')
  unblockUser(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('blockId', ParseIntPipe) blockId: number,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.unblockUser(userId, blockId)
  }

  private verifyCredentials(req: Request, userId: number) {
    const user = req.user as User
    if (user.id !== userId) {
      throw new UnauthorizedException('Wrong credentials.')
    }
  }

  @Post('update-password/:userId')
  async updatePassword(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updatePasswordDto: Omit<UpdateUserDto, 'email' | 'username'>,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.updateUser(userId, updatePasswordDto)
  }

  @Post('update-username/:userId')
  async updateUsername(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUsernameDto: Omit<UpdateUserDto, 'password' | 'email'>,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.updateUser(userId, updateUsernameDto)
  }

  @Post('update-email/:userId')
  async updateEmail(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateEmailDto: Omit<UpdateUserDto, 'password' | 'username'>,
  ) {
    this.verifyCredentials(req, userId)
    return this.userService.updateUser(userId, updateEmailDto)
  }
}
