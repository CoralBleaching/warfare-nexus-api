import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import { AuthSignInDto } from './dtos/auth.signin.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma as PrismaPostgres, User } from '.prisma/postgres-client'

@Injectable()
export class AuthService {
  private expiresIn: string

  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN')
  }

  private signToken(
    id: number,
    email: string,
    tokenVersion: number,
  ): Promise<string> {
    const payload = {
      sub: id,
      email: email,
      tokenVersion: tokenVersion,
    }
    return this.jwt.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.expiresIn,
    })
  }

  async signUp(
    data: PrismaPostgres.UserCreateInput,
  ): Promise<{ access_token: string }> {
    data = { ...data, password: await argon.hash(data.password) }
    const user = await this.prisma.postgres.user.create({ data })
    return {
      access_token: await this.signToken(
        user.id,
        user.email,
        user.tokenVersion,
      ),
    }
  }

  async signIn(auth: AuthSignInDto): Promise<{ access_token: string }> {
    const user = await this.prisma.postgres.user.findFirst({
      where: {
        OR: [
          auth.email ? { email: auth.email } : undefined,
          auth.username ? { username: auth.username } : undefined,
        ].filter(Boolean),
      },
    })
    if (!user) {
      throw new ForbiddenException('Invalid credentials (email)')
    }
    const match = await argon.verify(user.password, auth.password)
    if (!match) {
      throw new ForbiddenException('Invalid credentials (password')
    }
    return {
      access_token: await this.signToken(
        user.id,
        user.email,
        user.tokenVersion,
      ),
    }
  }

  async signOut(user: User) {
    await this.prisma.postgres.user.update({
      where: { id: user.id },
      data: { tokenVersion: user.tokenVersion + 1 },
    })
  }
}
