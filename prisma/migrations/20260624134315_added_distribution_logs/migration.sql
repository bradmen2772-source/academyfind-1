-- CreateTable
CREATE TABLE "lead_distribution_log" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "targetInstituteIds" TEXT[],
    "targetCount" INTEGER NOT NULL,
    "filters" TEXT,
    "bulkFilters" JSONB,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_distribution_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_distribution_log_enquiryId_idx" ON "lead_distribution_log"("enquiryId");

-- CreateIndex
CREATE INDEX "lead_distribution_log_adminId_idx" ON "lead_distribution_log"("adminId");

-- AddForeignKey
ALTER TABLE "lead_distribution_log" ADD CONSTRAINT "lead_distribution_log_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "institute_enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_distribution_log" ADD CONSTRAINT "lead_distribution_log_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
