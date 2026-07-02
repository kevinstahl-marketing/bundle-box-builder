/*
  Warnings:

  - A unique constraint covering the columns `[id,shop]` on the table `Builder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Builder_id_shop_key" ON "Builder"("id", "shop");
