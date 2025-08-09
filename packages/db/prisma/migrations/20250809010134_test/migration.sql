/*
  Warnings:

  - You are about to drop the column `brief` on the `artists_commission` table. All the data in the column will be lost.
  - You are about to drop the column `customerUserId` on the `artists_commission` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `artists_commission` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `artists_commission` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `artists_commission` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `artists_commission` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(14))` to `VarChar(191)`.
  - The primary key for the `catalog_painting_detail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `countryOfOrigin` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `framed` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `hasCertificate` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `signed` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `sizeCm` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - You are about to drop the column `surface` on the `catalog_painting_detail` table. All the data in the column will be lost.
  - The primary key for the `catalog_poster_detail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `finish` on the `catalog_poster_detail` table. All the data in the column will be lost.
  - You are about to drop the column `sizeCm` on the `catalog_poster_detail` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `catalog_poster_detail` table. All the data in the column will be lost.
  - The values [FURNITURE] on the enum `catalog_product_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `barcode` on the `catalog_variant` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `catalog_variant` table. All the data in the column will be lost.
  - You are about to drop the column `weightGr` on the `catalog_variant` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `common_user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(7))` to `Enum(EnumId(0))`.
  - You are about to drop the column `notes` on the `ops_fulfillment` table. All the data in the column will be lost.
  - The values [ALLOCATED,EXCEPTION] on the enum `ops_fulfillment_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `channel` on the `ops_support_ticket` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `ops_support_ticket` table. All the data in the column will be lost.
  - The values [PENDING] on the enum `ops_support_ticket_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [CRITICAL] on the enum `ops_support_ticket_priority` will be removed. If these variants are still used in the database, this will fail.
  - The values [ALLOCATED,RETURNED,CANCELED] on the enum `orders_order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `qty` on the `orders_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `snapshot` on the `orders_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `unitPriceCents` on the `orders_order_item` table. All the data in the column will be lost.
  - You are about to drop the column `chargeId` on the `orders_payment` table. All the data in the column will be lost.
  - You are about to drop the column `intentId` on the `orders_payment` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `orders_payment` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `orders_payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(11))` to `Enum(EnumId(4))`.
  - You are about to drop the column `credentialsEncrypted` on the `social_channel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `social_channel` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `social_channel` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `social_post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `social_post` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `social_post` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `social_post` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(12))` to `VarChar(191)`.
  - You are about to drop the `artists_artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artists_submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_furniture_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_price_rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ops_return_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_cart_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_promotion_redemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_post_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_schedule` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId]` on the table `catalog_painting_detail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `catalog_poster_detail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `catalog_variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `budgetCents` to the `artists_commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `artists_commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `artists_commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `artists_commission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensions` to the `catalog_painting_detail` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `catalog_painting_detail` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `medium` on table `catalog_painting_detail` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `catalog_poster_detail` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `printType` to the `catalog_poster_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `catalog_poster_detail` table without a default value. This is not possible if the table is not empty.
  - Made the column `paperType` on table `catalog_poster_detail` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `sku` to the `catalog_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `common_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ops_fulfillment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ops_support_ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ops_support_ticket` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `ops_support_ticket` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `orders_order` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `orders_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `placedAt` on table `orders_order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `priceCents` to the `orders_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `orders_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `orders_payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `social_channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `catalog_furniture_detail` DROP FOREIGN KEY `catalog_furniture_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_inventory` DROP FOREIGN KEY `catalog_inventory_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `orders_cart_item` DROP FOREIGN KEY `orders_cart_item_cartId_fkey`;

-- DropIndex
DROP INDEX `orders_payment_orderId_key` ON `orders_payment`;

-- AlterTable
ALTER TABLE `artists_commission` DROP COLUMN `brief`,
    DROP COLUMN `customerUserId`,
    DROP COLUMN `endDate`,
    DROP COLUMN `priceCents`,
    DROP COLUMN `startDate`,
    ADD COLUMN `budgetCents` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `deadline` DATETIME(3) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `catalog_painting_detail` DROP PRIMARY KEY,
    DROP COLUMN `countryOfOrigin`,
    DROP COLUMN `framed`,
    DROP COLUMN `hasCertificate`,
    DROP COLUMN `signed`,
    DROP COLUMN `sizeCm`,
    DROP COLUMN `style`,
    DROP COLUMN `surface`,
    ADD COLUMN `dimensions` VARCHAR(191) NOT NULL,
    ADD COLUMN `frameType` VARCHAR(191) NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `medium` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `catalog_poster_detail` DROP PRIMARY KEY,
    DROP COLUMN `finish`,
    DROP COLUMN `sizeCm`,
    DROP COLUMN `stock`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `printType` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` VARCHAR(191) NOT NULL,
    MODIFY `paperType` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `catalog_product` MODIFY `type` ENUM('PAINTING', 'POSTER', 'COLLECTIBLE') NOT NULL;

-- AlterTable
ALTER TABLE `catalog_variant` DROP COLUMN `barcode`,
    DROP COLUMN `currency`,
    DROP COLUMN `weightGr`,
    ADD COLUMN `dimensions` JSON NULL,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD COLUMN `stockLevel` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `weightGrams` INTEGER NULL,
    MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `common_user` ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `passwordHash` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('CUSTOMER', 'ARTIST', 'ADMIN', 'OPERATOR') NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE `ops_fulfillment` DROP COLUMN `notes`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PICKED', 'PACKED', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `ops_support_ticket` DROP COLUMN `channel`,
    DROP COLUMN `orderId`,
    ADD COLUMN `assignedToUserId` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    MODIFY `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE `orders_order` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    ALTER COLUMN `totalCents` DROP DEFAULT,
    MODIFY `placedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `orders_order_item` DROP COLUMN `qty`,
    DROP COLUMN `snapshot`,
    DROP COLUMN `unitPriceCents`,
    ADD COLUMN `priceCents` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders_payment` DROP COLUMN `chargeId`,
    DROP COLUMN `intentId`,
    DROP COLUMN `provider`,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'SAR',
    ADD COLUMN `method` VARCHAR(191) NOT NULL,
    ADD COLUMN `processedAt` DATETIME(3) NULL,
    ADD COLUMN `reference` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `social_channel` DROP COLUMN `credentialsEncrypted`,
    DROP COLUMN `name`,
    DROP COLUMN `provider`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `lastPosted` DATETIME(3) NULL,
    ADD COLUMN `platform` ENUM('INSTAGRAM', 'TWITTER', 'FACEBOOK', 'TIKTOK') NOT NULL;

-- AlterTable
ALTER TABLE `social_post` DROP COLUMN `error`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `sentAt`,
    ADD COLUMN `media` JSON NULL,
    ADD COLUMN `postedAt` DATETIME(3) NULL,
    ADD COLUMN `scheduledAt` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT';

-- DropTable
DROP TABLE `artists_artist`;

-- DropTable
DROP TABLE `artists_submission`;

-- DropTable
DROP TABLE `catalog_furniture_detail`;

-- DropTable
DROP TABLE `catalog_inventory`;

-- DropTable
DROP TABLE `catalog_price_rule`;

-- DropTable
DROP TABLE `ops_return_request`;

-- DropTable
DROP TABLE `orders_cart`;

-- DropTable
DROP TABLE `orders_cart_item`;

-- DropTable
DROP TABLE `orders_promotion_redemption`;

-- DropTable
DROP TABLE `social_post_log`;

-- DropTable
DROP TABLE `social_schedule`;

-- CreateTable
CREATE TABLE `common_account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `common_account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `common_session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_verification_token` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `common_verification_token_token_key`(`token`),
    INDEX `common_verification_token_identifier_idx`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_2fa_secret` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `common_2fa_secret_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalog_collectible_detail` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `material` VARCHAR(191) NOT NULL,
    `edition` VARCHAR(191) NULL,
    `certificate` VARCHAR(191) NULL,
    `rarity` VARCHAR(191) NULL,

    UNIQUE INDEX `catalog_collectible_detail_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artists_profile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NULL,
    `specialties` JSON NULL,
    `portfolio` JSON NULL,
    `commission` JSON NULL,

    UNIQUE INDEX `artists_profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `catalog_painting_detail_productId_key` ON `catalog_painting_detail`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `catalog_poster_detail_productId_key` ON `catalog_poster_detail`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `catalog_variant_sku_key` ON `catalog_variant`(`sku`);

-- AddForeignKey
ALTER TABLE `common_audit_log` ADD CONSTRAINT `common_audit_log_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `common_user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `common_account` ADD CONSTRAINT `common_account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `common_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `common_session` ADD CONSTRAINT `common_session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `common_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalog_collectible_detail` ADD CONSTRAINT `catalog_collectible_detail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `catalog_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_order_item` ADD CONSTRAINT `orders_order_item_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `catalog_variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ops_fulfillment` ADD CONSTRAINT `ops_fulfillment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `social_post` ADD CONSTRAINT `social_post_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `social_channel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
