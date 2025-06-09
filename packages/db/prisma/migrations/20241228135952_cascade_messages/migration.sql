-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_friendId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Friend"("friendId") ON DELETE CASCADE ON UPDATE CASCADE;
