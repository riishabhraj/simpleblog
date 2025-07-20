/*
  Warnings:

  - You are about to drop the column `sanityId` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_sanityId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sanityId";
