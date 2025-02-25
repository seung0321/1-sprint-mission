/*
  Warnings:

  - You are about to drop the column `tag` on the `Product` table. All the data in the column will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "category" AS ENUM ('FASHION', 'BEAUTY', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tag",
ADD COLUMN     "category" "category" NOT NULL;

-- DropEnum
DROP TYPE "tag";
