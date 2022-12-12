-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordResetExpires" DATE,
ADD COLUMN     "passwordResetToken" TEXT;
