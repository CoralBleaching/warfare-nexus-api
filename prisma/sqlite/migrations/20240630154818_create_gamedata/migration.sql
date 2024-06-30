-- CreateTable
CREATE TABLE "MovementType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primaryPower" REAL NOT NULL,
    "secondaryPower" REAL NOT NULL,
    "maxAmmo" INTEGER NOT NULL,
    "movementTypeId" INTEGER NOT NULL,
    "attackRange" INTEGER NOT NULL,
    "primaryWeaponName" TEXT NOT NULL,
    "primaryWeaponDescription" TEXT NOT NULL,
    "secondaryWeaponDescription" TEXT NOT NULL,
    CONSTRAINT "UnitType_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "MovementType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TerrainType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defense" INTEGER NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MovementType_code_key" ON "MovementType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_code_key" ON "UnitType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_code_key" ON "PropertyType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TerrainType_code_key" ON "TerrainType"("code");
