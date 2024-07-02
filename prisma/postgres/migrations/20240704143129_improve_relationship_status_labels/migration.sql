/*
  Warnings:

  - You are about to drop the column `typeCode` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `typeCode` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `typeCode` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `code` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "typeCode",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "typeCode",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "typeCode",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "moved" BOOLEAN NOT NULL DEFAULT false;
