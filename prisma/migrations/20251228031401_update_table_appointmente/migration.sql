-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
