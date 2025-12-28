-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completionNotes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod";
