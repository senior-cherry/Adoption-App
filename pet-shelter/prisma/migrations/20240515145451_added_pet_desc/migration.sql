/*
  Warnings:

  - You are about to drop the column `skills` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desc` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "skills",
ADD COLUMN     "desc" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";
