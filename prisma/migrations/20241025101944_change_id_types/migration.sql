/*
  Warnings:

  - The primary key for the `CPUinfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `NetworkInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RAMinfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Server` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `CPUinfo` DROP FOREIGN KEY `CPUinfo_server_id_fkey`;

-- DropForeignKey
ALTER TABLE `NetworkInfo` DROP FOREIGN KEY `NetworkInfo_server_id_fkey`;

-- DropForeignKey
ALTER TABLE `RAMinfo` DROP FOREIGN KEY `RAMinfo_server_id_fkey`;

-- AlterTable
ALTER TABLE `CPUinfo` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `server_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `NetworkInfo` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `server_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `RAMinfo` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `server_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Server` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CPUinfo` ADD CONSTRAINT `CPUinfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RAMinfo` ADD CONSTRAINT `RAMinfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkInfo` ADD CONSTRAINT `NetworkInfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
