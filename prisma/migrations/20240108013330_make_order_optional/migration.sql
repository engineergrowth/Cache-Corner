-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_order_id_fkey";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
