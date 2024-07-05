import { Module } from '@nestjs/common'
import { GameplayService } from './gameplay.service'
import { GameplayController } from './gameplay.controller'
import { MapService } from 'src/map/map.service'

@Module({
  providers: [GameplayService, MapService],
  controllers: [GameplayController],
})
export class GameplayModule {}
