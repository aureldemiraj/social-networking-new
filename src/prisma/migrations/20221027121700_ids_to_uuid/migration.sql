/*
  Warnings:

  - The primary key for the `communities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `event_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users_on_communities` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

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
ALTER TABLE "communities" DROP CONSTRAINT "communities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "communities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "communities_id_seq";

-- AlterTable
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_pkey",
ALTER COLUMN "eventId" SET DATA TYPE TEXT,
ALTER COLUMN "participantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_participants_pkey" PRIMARY KEY ("eventId", "participantId");

-- AlterTable
ALTER TABLE "events" DROP CONSTRAINT "events_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "eventOrganizer" SET DATA TYPE TEXT,
ALTER COLUMN "communityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "events_id_seq";

-- AlterTable
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "communityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "users_on_communities" DROP CONSTRAINT "users_on_communities_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "communityId" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_on_communities_pkey" PRIMARY KEY ("userId", "communityId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventOrganizer_fkey" FOREIGN KEY ("eventOrganizer") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_communities" ADD CONSTRAINT "users_on_communities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_communities" ADD CONSTRAINT "users_on_communities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
