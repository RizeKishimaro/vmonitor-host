/*
  Warnings:

  - Added the required column `ssh_host` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssh_port` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Server` ADD COLUMN `ssh_host` VARCHAR(191) NOT NULL,
    ADD COLUMN `ssh_port` INTEGER NOT NULL;
