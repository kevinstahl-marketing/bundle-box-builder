-- AlterTable
ALTER TABLE "Builder" ADD COLUMN "productHandle" TEXT;
ALTER TABLE "Builder" ADD COLUMN "productId" TEXT;
ALTER TABLE "Builder" ADD COLUMN "productImage" TEXT;
ALTER TABLE "Builder" ADD COLUMN "productTitle" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuilderOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stepId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PRODUCT',
    "productId" TEXT,
    "variantId" TEXT,
    "productTitle" TEXT,
    "variantTitle" TEXT,
    "image" TEXT,
    "priceAdjustment" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuilderOption_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "BuilderStep" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuilderOption" ("createdAt", "id", "position", "stepId", "title", "updatedAt") SELECT "createdAt", "id", "position", "stepId", "title", "updatedAt" FROM "BuilderOption";
DROP TABLE "BuilderOption";
ALTER TABLE "new_BuilderOption" RENAME TO "BuilderOption";
CREATE TABLE "new_BuilderStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "builderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "minSelections" INTEGER NOT NULL DEFAULT 1,
    "maxSelections" INTEGER NOT NULL DEFAULT 1,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuilderStep_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "Builder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuilderStep" ("builderId", "createdAt", "id", "position", "title", "updatedAt") SELECT "builderId", "createdAt", "id", "position", "title", "updatedAt" FROM "BuilderStep";
DROP TABLE "BuilderStep";
ALTER TABLE "new_BuilderStep" RENAME TO "BuilderStep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
