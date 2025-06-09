/*
  Warnings:

  - Changed the type of `message` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageType" "MessageType" NOT NULL DEFAULT 'text',
DROP COLUMN "message",
ADD COLUMN     "message" TEXT NOT NULL;
