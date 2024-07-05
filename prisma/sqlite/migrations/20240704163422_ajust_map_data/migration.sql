/*
  Warnings:

  - The primary key for the `Map` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Map` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Map" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_Map" ("data", "description", "name") SELECT "data", "description", "name" FROM "Map";
DROP TABLE "Map";
ALTER TABLE "new_Map" RENAME TO "Map";
CREATE UNIQUE INDEX "Map_name_key" ON "Map"("name");
CREATE UNIQUE INDEX "Map_data_key" ON "Map"("data");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
