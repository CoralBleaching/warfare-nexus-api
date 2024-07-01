/*
  Warnings:

  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SINGLE', 'PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('FRIEND', 'BLOCKED', 'PENDING');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "status" "MatchStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Relationship" (
    "status" "RelationshipStatus" NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_user1Id_user2Id_key" ON "Relationship"("user1Id", "user2Id");

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
