/*
  Warnings:

  - The values [PENDING] on the enum `RelationshipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationshipStatus_new" AS ENUM ('FRIEND', 'BLOCKED_USER_1', 'BLOCKED_USER_2', 'BLOCKED_BOTH', 'PENDING_USER_1', 'PENDING_USER_2');
ALTER TABLE "Relationship" ALTER COLUMN "status" TYPE "RelationshipStatus_new" USING ("status"::text::"RelationshipStatus_new");
ALTER TYPE "RelationshipStatus" RENAME TO "RelationshipStatus_old";
ALTER TYPE "RelationshipStatus_new" RENAME TO "RelationshipStatus";
DROP TYPE "RelationshipStatus_old";
COMMIT;
