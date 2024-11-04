-- DropForeignKey
ALTER TABLE `CPUinfo` DROP FOREIGN KEY `CPUinfo_server_id_fkey`;

-- DropForeignKey
ALTER TABLE `NetworkInfo` DROP FOREIGN KEY `NetworkInfo_server_id_fkey`;

-- DropForeignKey
ALTER TABLE `RAMinfo` DROP FOREIGN KEY `RAMinfo_server_id_fkey`;

-- DropForeignKey
ALTER TABLE `SystemDownTime` DROP FOREIGN KEY `SystemDownTime_server_id_fkey`;

-- AddForeignKey
ALTER TABLE `SystemDownTime` ADD CONSTRAINT `SystemDownTime_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CPUinfo` ADD CONSTRAINT `CPUinfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RAMinfo` ADD CONSTRAINT `RAMinfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkInfo` ADD CONSTRAINT `NetworkInfo_server_id_fkey` FOREIGN KEY (`server_id`) REFERENCES `Server`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
