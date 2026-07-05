-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "sourceType" TEXT NOT NULL DEFAULT 'SPECIFIC_PRODUCTS',
    "sourceValue" TEXT,
    CONSTRAINT "BuilderStep_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "Builder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuilderStep" ("builderId", "createdAt", "id", "isRequired", "isVisible", "maxSelections", "minSelections", "position", "title", "updatedAt") SELECT "builderId", "createdAt", "id", "isRequired", "isVisible", "maxSelections", "minSelections", "position", "title", "updatedAt" FROM "BuilderStep";
DROP TABLE "BuilderStep";
ALTER TABLE "new_BuilderStep" RENAME TO "BuilderStep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
