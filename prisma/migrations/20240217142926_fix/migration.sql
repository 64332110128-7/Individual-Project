/*
  Warnings:

  - You are about to drop the `status_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `status_product` DROP FOREIGN KEY `Status_product_product_id_fkey`;

-- DropTable
DROP TABLE `status_product`;
