import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Prisma as PrismaPostgres, User } from '.prisma/postgres-client'
import { AuthService } from './auth.service'
import { AuthSignInDto } from './dtos/auth.signin.dto'
import { JwtAuthGuard } from './jwt.auth.guard'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body() auth: PrismaPostgres.UserCreateInput,
  ): Promise<{ access_token: string }> {
    return this.authService.signUp(auth)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() auth: AuthSignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(auth)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(@Req() req: Request) {
    const user = req.user as User
    this.authService.signOut(user)
  }
}
