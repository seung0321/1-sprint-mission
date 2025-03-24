/*
  Warnings:

  - You are about to drop the `ARTICLE` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ARTICLE";

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
