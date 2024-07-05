import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { MapInfo, MapService } from 'src/map/map.service'

@Injectable()
export class GameplayService {
  private terrainTypeIds: Map<string, number>
  private movementTypeIds: Map<string, number>

  constructor(
    private prisma: PrismaService,
    private readonly mapService: MapService,
  ) {
    this.terrainTypeIds = new Map<string, number>()
    prisma.sqlite.terrainType
      .findMany({
        select: { id: true, code: true },
      })
      .then((arr) => arr.map((value) => this.terrainTypeIds.set(value.code, value.id)))
    this.movementTypeIds = new Map<string, number>()
    prisma.sqlite.movementType
      .findMany({
        select: { id: true, code: true },
      })
      .then((arr) => arr.map((value) => this.movementTypeIds.set(value.code, value.id)))
  }

  private getTerrainFromMap(pos: [number, number], mapInfo: MapInfo) {
    const [i, j] = pos
    const { nrows, ncols, data } = mapInfo
    return data.charAt(i * ncols + j)
  }

  private async isTraversible(terrainTypeCode: string, movementTypeCode: string) {
    const terrainTypeId = this.terrainTypeIds.get(terrainTypeCode)
    const movementTypeId = this.movementTypeIds.get(movementTypeCode)
    return this.prisma.sqlite.traversible
      .findUnique({
        where: { movementTypeId_terrainTypeId: { terrainTypeId, movementTypeId } },
        select: { traversible: true },
      })
      .then((value) => value.traversible)
  }

  private async isValidPath(
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
    const pathSet = new Set(path.map((pair) => String(pair)))
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
