/*
  Warnings:

  - A unique constraint covering the columns `[nick]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_nick_key` ON `User`(`nick`);
