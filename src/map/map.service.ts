import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '.prisma/sqlite-client'

export interface MapInfo {
  nrows: number
  ncols: number
  data: string
}

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  create(createMapDto: Prisma.MapCreateInput) {
    return this.prisma.sqlite.map.create({
      data: createMapDto,
    })
  }

  findAll() {
    return this.prisma.sqlite.map.findMany()
  }

  findOne(id: number) {
    return this.prisma.sqlite.map.findUnique({
      where: { id },
    })
  }

  update(id: number, updateMapDto: Prisma.MapUpdateInput) {
    return this.prisma.sqlite.map.update({
      where: { id },
      data: updateMapDto,
    })
  }

  remove(id: number) {
    return this.prisma.sqlite.map.delete({
      where: { id },
    })
  }

  async getMapInfo(id: number): Promise<MapInfo> {
    const map = await this.findOne(id)
    const [nrowsStr, ncolsStr, data] = map.data.split(';')
    return {
      nrows: parseInt(nrowsStr),
      ncols: parseInt(ncolsStr),
      data,
    }
  }
}
