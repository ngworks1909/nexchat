/*
  Warnings:

  - A unique constraint covering the columns `[userId1,userId2]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId1_userId2_key" ON "Friend"("userId1", "userId2");

-- CreateIndex
CREATE UNIQUE INDEX "Request_senderId_receiverId_key" ON "Request"("senderId", "receiverId");
