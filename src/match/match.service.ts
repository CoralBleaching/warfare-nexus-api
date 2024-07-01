import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma as PrismaPostgres } from '.prisma/postgres-client'

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createSingle(match: PrismaPostgres.MatchCreateInput) {
    return this.prisma.postgres.match.create({ data: match })
  }
}
