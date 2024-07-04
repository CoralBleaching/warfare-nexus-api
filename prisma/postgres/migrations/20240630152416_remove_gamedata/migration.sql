/*
  Warnings:

  - You are about to drop the column `unitTypeId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the `MovementType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TerrainType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `typeCode` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeCode` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeCode` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_typeId_fkey";

-- DropForeignKey
ALTER TABLE "UnitType" DROP CONSTRAINT "UnitType_movementTypeId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "unitTypeId",
ADD COLUMN     "typeCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "typeId",
ADD COLUMN     "typeCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "typeId",
ADD COLUMN     "typeCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "MovementType";

-- DropTable
DROP TABLE "PropertyType";

-- DropTable
DROP TABLE "TerrainType";

-- DropTable
DROP TABLE "UnitType";
