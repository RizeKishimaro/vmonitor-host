/*
  Warnings:

  - You are about to drop the column `network_usage` on the `NetworkInfo` table. All the data in the column will be lost.
  - Added the required column `download_network_usage` to the `NetworkInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upload_network_usage` to the `NetworkInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NetworkInfo` DROP COLUMN `network_usage`,
    ADD COLUMN `download_network_usage` INTEGER NOT NULL,
    ADD COLUMN `upload_network_usage` INTEGER NOT NULL;
