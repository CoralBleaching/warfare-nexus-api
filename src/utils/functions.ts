import { Prisma as PrismaPostgres, RelationshipStatus, MatchStatus } from '.prisma/postgres-client'
import { Prisma as PrismaSqlite } from '.prisma/sqlite-client'
import { PRISMA_RECORD_NOT_FOUND, PRISMA_UNIQUE_CONSTRAINT_VIOLATION } from './constants'
import { BadRequestException } from '@nestjs/common'
import { throws } from 'assert'

export function handleError(err: any, msg: string) {
  if (err instanceof PrismaPostgres.PrismaClientKnownRequestError) {
    switch (err.code) {
      case PRISMA_RECORD_NOT_FOUND:
        throw new BadRequestException(msg)
      case PRISMA_UNIQUE_CONSTRAINT_VIOLATION:
        throw new BadRequestException(msg)
    }
  }
  throw err
}
