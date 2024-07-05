/*
  Warnings:

  - Added the required column `range` to the `MovementType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Traversible" (
    "movementTypeId" INTEGER NOT NULL,
    "terrainTypeId" INTEGER NOT NULL,
    "traversible" BOOLEAN NOT NULL,
    "penalty" INTEGER NOT NULL,
    CONSTRAINT "Traversible_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "MovementType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Traversible_terrainTypeId_fkey" FOREIGN KEY ("terrainTypeId") REFERENCES "TerrainType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MovementType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "range" INTEGER NOT NULL,
    "code" TEXT NOT NULL
);
INSERT INTO "new_MovementType" ("code", "description", "id", "name") SELECT "code", "description", "id", "name" FROM "MovementType";
DROP TABLE "MovementType";
ALTER TABLE "new_MovementType" RENAME TO "MovementType";
CREATE UNIQUE INDEX "MovementType_code_key" ON "MovementType"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Traversible_movementTypeId_terrainTypeId_key" ON "Traversible"("movementTypeId", "terrainTypeId");
