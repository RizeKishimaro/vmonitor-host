/*
  Warnings:

  - You are about to drop the column `formatted_download_speed` on the `NetworkInfo` table. All the data in the column will be lost.
  - You are about to drop the column `formatted_upload_speed` on the `NetworkInfo` table. All the data in the column will be lost.
  - You are about to alter the column `network_usage` on the `NetworkInfo` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `NetworkInfo` DROP COLUMN `formatted_download_speed`,
    DROP COLUMN `formatted_upload_speed`,
    MODIFY `network_usage` DOUBLE NOT NULL;
