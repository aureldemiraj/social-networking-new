/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `event_participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_participantId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_communityId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_eventOrganizer_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_communityId_fkey";

-- DropForeignKey
ALTER TABLE "users_on_communities" DROP CONSTRAINT "users_on_communities_communityId_fkey";

-- DropForeignKey
ALTER TABLE "users_on_communities" DROP CONSTRAINT "users_on_communities_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive";

-- DropTable
DROP TABLE "event_participants";

-- CreateTable
CREATE TABLE "event_subscribers" (
    "eventId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,

    CONSTRAINT "event_subscribers_pkey" PRIMARY KEY ("eventId","subscriberId")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventOrganizer_fkey" FOREIGN KEY ("eventOrganizer") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_communities" ADD CONSTRAINT "users_on_communities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_communities" ADD CONSTRAINT "users_on_communities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_subscribers" ADD CONSTRAINT "event_subscribers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_subscribers" ADD CONSTRAINT "event_subscribers_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
