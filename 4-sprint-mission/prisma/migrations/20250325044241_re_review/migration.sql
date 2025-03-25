/*
  Warnings:

  - You are about to drop the column `productId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "productId",
ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
