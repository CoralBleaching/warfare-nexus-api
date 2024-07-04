-- AlterEnum
ALTER TYPE "MatchStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "turn" SET DEFAULT 1;
