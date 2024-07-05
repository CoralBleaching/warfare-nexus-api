import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { MapInfo, MapService } from 'src/map/map.service'

@Injectable()
export class GameplayService {
  constructor(
    private prisma: PrismaService,
    private readonly mapService: MapService,
  ) {}

  private getTerrainFromMap(pos: [number, number], mapInfo: MapInfo) {
    const [i, j] = pos
    const { nrows, ncols, data } = mapInfo
    return data.charAt(i * ncols + j)
  }

  private async isTraversible(terrainTypeCode: string, movementTypeCode: string) {
    const terrainTypeId = await this.prisma.sqlite.terrainType
      .findUnique({
        where: { code: terrainTypeCode },
        select: { id: true },
      })
      .then((value) => value.id)
    const movementTypeId = await this.prisma.sqlite.movementType
      .findUnique({
        where: { code: movementTypeCode },
        select: { id: true },
      })
      .then((value) => value.id)
    return this.prisma.sqlite.traversible
      .findUnique({
        where: { movementTypeId_terrainTypeId: { terrainTypeId, movementTypeId } },
        select: { traversible: true },
      })
      .then((value) => value.traversible)
  }

  private async isPathValid(
    matchId: number,
    userId: number,
    path: [number, number][],
    mapId: number,
    movementTypeCode: string,
  ) {
    const info = await this.mapService.getMapInfo(mapId)

    if (
      !path.every((pos) => this.isTraversible(this.getTerrainFromMap(pos, info), movementTypeCode))
    ) {
      return false
    }

    const opponentId = await this.prisma.postgres.match
      .findUnique({
        where: { id: matchId },
        select: { user2Id: true },
      })
      .then((value) => value.user2Id)
    const enemyUnitPositions = await this.prisma.postgres.unit
      .findMany({
        where: { userId: opponentId, matchId },
        select: { position: true },
      })
      .then((arr) => arr.map((value) => value.position))

    const pathSet = new Set(path.sort().map((pair) => String(pair)))

    if (enemyUnitPositions.some((enemyPosition) => pathSet.has(enemyPosition))) {
      return false
    }

    const friendlyUnitPositions = await this.prisma.postgres.unit
      .findMany({
        where: { userId, matchId },
        select: { position: true },
      })
      .then((arr) => arr.map((value) => value.position))

    if (friendlyUnitPositions.some((pos) => String(path[path.length - 1]) === pos)) {
      return false
    }

    return true
  }
}
