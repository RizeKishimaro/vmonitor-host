/*
  Warnings:

  - You are about to drop the column `created_at` on the `CPUinfo` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `CPUinfo` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `NetworkInfo` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `NetworkInfo` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `RAMinfo` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `RAMinfo` table. All the data in the column will be lost.
  - Added the required column `start_time` to the `CPUinfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `NetworkInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `RAMinfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CPUinfo` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `end_time` DATETIME(3) NULL,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `NetworkInfo` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `end_time` DATETIME(3) NULL,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `RAMinfo` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `end_time` DATETIME(3) NULL,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;
