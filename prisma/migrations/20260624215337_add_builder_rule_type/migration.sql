-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Builder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'BUILD_YOUR_OWN',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT,
    "productTitle" TEXT,
    "productHandle" TEXT,
    "productImage" TEXT,
    "ruleType" TEXT NOT NULL DEFAULT 'NONE',
    "minSelections" INTEGER,
    "maxSelections" INTEGER,
    "exactSelections" INTEGER
);
INSERT INTO "new_Builder" ("createdAt", "id", "mode", "name", "productHandle", "productId", "productImage", "productTitle", "shop", "status", "updatedAt") SELECT "createdAt", "id", "mode", "name", "productHandle", "productId", "productImage", "productTitle", "shop", "status", "updatedAt" FROM "Builder";
DROP TABLE "Builder";
ALTER TABLE "new_Builder" RENAME TO "Builder";
CREATE TABLE "new_BuilderStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "builderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "minSelections" INTEGER NOT NULL DEFAULT 0,
    "maxSelections" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuilderStep_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "Builder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuilderStep" ("builderId", "createdAt", "id", "isRequired", "isVisible", "maxSelections", "minSelections", "position", "title", "updatedAt") SELECT "builderId", "createdAt", "id", "isRequired", "isVisible", "maxSelections", "minSelections", "position", "title", "updatedAt" FROM "BuilderStep";
DROP TABLE "BuilderStep";
ALTER TABLE "new_BuilderStep" RENAME TO "BuilderStep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
