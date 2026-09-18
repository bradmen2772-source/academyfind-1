/*
  Warnings:

  - A unique constraint covering the columns `[instituteId]` on the table `sales_assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sales_assignment_salesManagerId_instituteId_key";

-- CreateIndex
CREATE UNIQUE INDEX "sales_assignment_instituteId_key" ON "sales_assignment"("instituteId");
