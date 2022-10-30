/*
  Warnings:

  - You are about to drop the column `passwordConfirm` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `communities` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordConfirm";

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_key" ON "communities"("name");
