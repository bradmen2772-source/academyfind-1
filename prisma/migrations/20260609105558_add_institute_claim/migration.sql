-- CreateTable
CREATE TABLE "institute_claim" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institute_claim_instituteId_idx" ON "institute_claim"("instituteId");

-- CreateIndex
CREATE INDEX "institute_claim_userId_idx" ON "institute_claim"("userId");

-- CreateIndex
CREATE INDEX "institute_claim_status_idx" ON "institute_claim"("status");

-- AddForeignKey
ALTER TABLE "institute_claim" ADD CONSTRAINT "institute_claim_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_claim" ADD CONSTRAINT "institute_claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
