/*
  Warnings:

  - You are about to drop the column `platfrom` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "platfrom",
ADD COLUMN     "platform" "Platform" NOT NULL DEFAULT 'LINKEDIN';
