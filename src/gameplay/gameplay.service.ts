import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { MapInfo, MapService } from 'src/map/map.service'

@Injectable()
export class GameplayService {
  private terrainTypeIds: Map<string, number>
  private movementTypeIds: Map<string, number>
  private isTraversible: Map<string, boolean>

  constructor(
    private prisma: PrismaService,
    private readonly mapService: MapService,
  ) {
    this.isTraversible = new Map()
    prisma.sqlite.traversible
      .findMany({
        select: {
          terrainType: true,
          movementType: true,
          traversible: true,
        },
      })
      .then((arr) =>
        arr.map((value) => {
          this.isTraversible.set(
            value.terrainType.code + value.movementType.code,
            value.traversible,
          )
        }),
      )
  }

  private getTerrainFromMap(pos: [number, number], mapInfo: MapInfo) {
    const [i, j] = pos
    const { nrows, ncols, data } = mapInfo
    return data.charAt(i * ncols + j)
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
      !path.every((pos) =>
        this.isTraversible.get(this.getTerrainFromMap(pos, info) + movementTypeCode),
      )
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
