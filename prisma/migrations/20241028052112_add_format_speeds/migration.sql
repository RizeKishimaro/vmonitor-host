-- AlterTable
ALTER TABLE `NetworkInfo` ADD COLUMN `formatted_download_speed` VARCHAR(191) NULL,
    ADD COLUMN `formatted_upload_speed` VARCHAR(191) NULL,
    MODIFY `network_usage` INTEGER NOT NULL;
