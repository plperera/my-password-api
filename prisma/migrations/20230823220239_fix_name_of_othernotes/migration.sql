/*
  Warnings:

  - You are about to drop the `saverdOtherNotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "saverdOtherNotes" DROP CONSTRAINT "saverdOtherNotes_userId_fkey";

-- DropTable
DROP TABLE "saverdOtherNotes";

-- CreateTable
CREATE TABLE "savedOtherNotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savedOtherNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "savedOtherNotes_name_key" ON "savedOtherNotes"("name");

-- AddForeignKey
ALTER TABLE "savedOtherNotes" ADD CONSTRAINT "savedOtherNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
