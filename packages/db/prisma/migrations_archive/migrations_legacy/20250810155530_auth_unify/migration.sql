/*
  Warnings:

  - You are about to rename the column `passwordHash` to `hashedPassword` on the `common_user` table.
  - Added the required column `updatedAt` to the `common_user` table with a default value.

*/
-- AlterTable
ALTER TABLE `common_user` 
    ADD COLUMN `hashedPassword` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Copy data from passwordHash to hashedPassword
UPDATE `common_user` SET `hashedPassword` = `passwordHash` WHERE `passwordHash` IS NOT NULL;

-- Drop the old column
ALTER TABLE `common_user` DROP COLUMN `passwordHash`;
