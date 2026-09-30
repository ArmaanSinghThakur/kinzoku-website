-- CreateEnum
CREATE TYPE "email_kind" AS ENUM ('buyer_confirmation', 'sales_alert');

-- CreateTable
CREATE TABLE "email_outbox" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "kind" "email_kind" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" VARCHAR(500),
    "next_attempt_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_outbox_sent_at_next_attempt_at_idx" ON "email_outbox"("sent_at", "next_attempt_at");

-- CreateIndex
CREATE UNIQUE INDEX "email_outbox_rfq_id_kind_key" ON "email_outbox"("rfq_id", "kind");

-- AddForeignKey
ALTER TABLE "email_outbox" ADD CONSTRAINT "email_outbox_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
