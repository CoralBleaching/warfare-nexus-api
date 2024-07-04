/*
  Warnings:

  - You are about to drop the column `propertyTypeId` on the `Property` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_propertyTypeId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "propertyTypeId",
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
