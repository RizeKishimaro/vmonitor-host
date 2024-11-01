/*
  Warnings:

  - Added the required column `down_reason` to the `SystemDownTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server_id` to the `SystemDownTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SystemDownTime` ADD COLUMN `down_reason` ENUM('TIMEOUT', 'BAD_GATEWAY', 'UNDER_MAINTENANCE') NOT NULL,
    ADD COLUMN `server_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SystemDownTime` ADD CONSTRAINT `SystemDownTime_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
