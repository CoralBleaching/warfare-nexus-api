import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Prisma, PrismaClient, User } from '@prisma/client'

@Injectable()
export class AuthService {
  private expiresIn: string

  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaClient,
  ) {
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN')
  }

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }
}
