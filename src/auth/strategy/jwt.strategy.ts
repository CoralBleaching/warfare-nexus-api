import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '.prisma/postgres-client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: { sub: number; email: string; tokenVersion: number }): Promise<User> {
    const user = await this.prisma.postgres.user.findUnique({
      where: { id: payload.sub },
    })
    if (!user) {
      throw new UnauthorizedException()
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token is invalid.')
    }
    delete user.password
    return user
  }
}
