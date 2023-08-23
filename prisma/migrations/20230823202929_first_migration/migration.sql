/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ordder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ordderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paymentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ordder" DROP CONSTRAINT "ordder_addressId_fkey";

-- DropForeignKey
ALTER TABLE "ordder" DROP CONSTRAINT "ordder_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ordder" DROP CONSTRAINT "ordder_userId_fkey";

-- DropForeignKey
ALTER TABLE "ordderItem" DROP CONSTRAINT "ordderItem_ordderId_fkey";

-- DropForeignKey
ALTER TABLE "ordderItem" DROP CONSTRAINT "ordderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_ordderId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_paymentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "ordder";

-- DropTable
DROP TABLE "ordderItem";

-- DropTable
DROP TABLE "paymentType";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
