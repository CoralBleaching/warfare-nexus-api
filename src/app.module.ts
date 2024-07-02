import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { MatchModule } from './match/match.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { GameplayModule } from './gameplay/gameplay.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MatchModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GameplayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
