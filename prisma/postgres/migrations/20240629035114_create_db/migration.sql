/*
  Warnings:

  - You are about to drop the column `player1Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `unitTypeId` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `user1Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_unitTypeId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
ADD COLUMN     "user1Id" INTEGER NOT NULL,
ADD COLUMN     "user2Id" INTEGER;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "unitTypeId",
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
