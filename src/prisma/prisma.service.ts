import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient as PostgresPrismaClient } from '.prisma/postgres-client'
import { PrismaClient as SqlitePrismaClient } from '.prisma/sqlite-client'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  postgres: PostgresPrismaClient
  sqlite: SqlitePrismaClient

  constructor() {
    this.postgres = new PostgresPrismaClient()
    this.sqlite = new SqlitePrismaClient()
  }

  async onModuleInit() {
    await this.postgres.$connect()
    await this.sqlite.$connect()
  }
  async onModuleDestroy() {
    await this.postgres.$disconnect()
    await this.sqlite.$disconnect()
  }
}
