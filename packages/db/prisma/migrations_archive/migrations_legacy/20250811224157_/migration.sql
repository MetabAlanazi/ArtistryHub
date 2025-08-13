/*
  Warnings:

  - You are about to drop the `artists_commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artists_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_artist_ref` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_collectible_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_painting_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_poster_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_2fa_secret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_service_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_verification_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ops_fulfillment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ops_shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ops_support_ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_order_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders_payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlist_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `catalog_collectible_detail` DROP FOREIGN KEY `catalog_collectible_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_painting_detail` DROP FOREIGN KEY `catalog_painting_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_poster_detail` DROP FOREIGN KEY `catalog_poster_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_product` DROP FOREIGN KEY `catalog_product_artistRefId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_variant` DROP FOREIGN KEY `catalog_variant_productId_fkey`;

-- DropForeignKey
ALTER TABLE `common_account` DROP FOREIGN KEY `common_account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `common_address` DROP FOREIGN KEY `common_address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `common_service_token` DROP FOREIGN KEY `common_service_token_userId_fkey`;

-- DropForeignKey
ALTER TABLE `common_session` DROP FOREIGN KEY `common_session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ops_fulfillment` DROP FOREIGN KEY `ops_fulfillment_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `ops_shipment` DROP FOREIGN KEY `ops_shipment_fulfillmentId_fkey`;

-- DropForeignKey
ALTER TABLE `orders_order_item` DROP FOREIGN KEY `orders_order_item_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orders_order_item` DROP FOREIGN KEY `orders_order_item_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `orders_payment` DROP FOREIGN KEY `orders_payment_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `social_post` DROP FOREIGN KEY `social_post_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist_items` DROP FOREIGN KEY `wishlist_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist_items` DROP FOREIGN KEY `wishlist_items_userId_fkey`;

-- DropTable
DROP TABLE `artists_commission`;

-- DropTable
DROP TABLE `artists_profile`;

-- DropTable
DROP TABLE `catalog_artist_ref`;

-- DropTable
DROP TABLE `catalog_collectible_detail`;

-- DropTable
DROP TABLE `catalog_painting_detail`;

-- DropTable
DROP TABLE `catalog_poster_detail`;

-- DropTable
DROP TABLE `catalog_product`;

-- DropTable
DROP TABLE `catalog_variant`;

-- DropTable
DROP TABLE `common_2fa_secret`;

-- DropTable
DROP TABLE `common_account`;

-- DropTable
DROP TABLE `common_address`;

-- DropTable
DROP TABLE `common_audit_log`;

-- DropTable
DROP TABLE `common_service_token`;

-- DropTable
DROP TABLE `common_session`;

-- DropTable
DROP TABLE `common_user`;

-- DropTable
DROP TABLE `common_verification_token`;

-- DropTable
DROP TABLE `ops_fulfillment`;

-- DropTable
DROP TABLE `ops_shipment`;

-- DropTable
DROP TABLE `ops_support_ticket`;

-- DropTable
DROP TABLE `orders_order`;

-- DropTable
DROP TABLE `orders_order_item`;

-- DropTable
DROP TABLE `orders_payment`;

-- DropTable
DROP TABLE `social_channel`;

-- DropTable
DROP TABLE `social_post`;

-- DropTable
DROP TABLE `wishlist_items`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `role` ENUM('customer', 'artist', 'admin', 'operator', 'service', 'social_worker') NOT NULL DEFAULT 'customer',
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `permissionsVersion` INTEGER NOT NULL DEFAULT 0,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUsedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_tokenHash_key`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `security_audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `event` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `security_audit_logs` ADD CONSTRAINT `security_audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
