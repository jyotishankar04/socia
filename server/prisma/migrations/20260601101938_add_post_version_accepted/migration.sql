-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "is_accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "is_last_conversation_post" SET DEFAULT false;
