/*
  Warnings:

  - Added the required column `id` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Map" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Map" ("data", "description", "name") SELECT "data", "description", "name" FROM "Map";
DROP TABLE "Map";
ALTER TABLE "new_Map" RENAME TO "Map";
CREATE UNIQUE INDEX "Map_id_key" ON "Map"("id");
CREATE UNIQUE INDEX "Map_name_key" ON "Map"("name");
CREATE UNIQUE INDEX "Map_data_key" ON "Map"("data");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
