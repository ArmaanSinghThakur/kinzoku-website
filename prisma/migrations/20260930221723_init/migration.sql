-- CreateEnum
CREATE TYPE "staff_role" AS ENUM ('admin', 'sales');

-- CreateEnum
CREATE TYPE "request_type" AS ENUM ('nails', 'wire', 'bars', 'cbam_advisory', 'other');

-- CreateEnum
CREATE TYPE "rfq_status" AS ENUM ('received', 'in_review', 'quote_sent', 'closed');

-- CreateEnum
CREATE TYPE "chat_sender" AS ENUM ('buyer', 'staff');

-- CreateTable
CREATE TABLE "staff_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "staff_role" NOT NULL DEFAULT 'sales',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "vat_number" VARCHAR(30),
    "client_since" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfqs" (
    "id" UUID NOT NULL,
    "reference" VARCHAR(20) NOT NULL,
    "type" "request_type" NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "contact_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(50),
    "delivery_country" VARCHAR(200),
    "specification" TEXT,
    "quantity" VARCHAR(100),
    "delivery_terms" VARCHAR(200),
    "message" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "status" "rfq_status" NOT NULL DEFAULT 'received',
    "status_token_hash" CHAR(64) NOT NULL,
    "company_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_reference_counters" (
    "year" INTEGER NOT NULL,
    "last_number" INTEGER NOT NULL,

    CONSTRAINT "rfq_reference_counters_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "rfq_files" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "storage_path" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_status_history" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "from_status" "rfq_status",
    "to_status" "rfq_status" NOT NULL,
    "changed_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "sender" "chat_sender" NOT NULL,
    "staff_user_id" UUID,
    "body" TEXT NOT NULL,
    "client_message_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ(3),

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cbam_estimates" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "product_type" VARCHAR(200) NOT NULL,
    "tonnes" DECIMAL(12,3) NOT NULL,
    "emission_factor" DECIMAL(8,4) NOT NULL,
    "phase_in_rate" DECIMAL(6,5) NOT NULL,
    "carbon_price" DECIMAL(10,2) NOT NULL,
    "estimated_cost" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cbam_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_reference_key" ON "rfqs"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_status_token_hash_key" ON "rfqs"("status_token_hash");

-- CreateIndex
CREATE INDEX "rfqs_status_created_at_idx" ON "rfqs"("status", "created_at");

-- CreateIndex
CREATE INDEX "rfqs_created_at_idx" ON "rfqs"("created_at");

-- CreateIndex
CREATE INDEX "rfqs_company_id_idx" ON "rfqs"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_files_storage_path_key" ON "rfq_files"("storage_path");

-- CreateIndex
CREATE INDEX "rfq_files_rfq_id_idx" ON "rfq_files"("rfq_id");

-- CreateIndex
CREATE INDEX "rfq_status_history_rfq_id_created_at_idx" ON "rfq_status_history"("rfq_id", "created_at");

-- CreateIndex
CREATE INDEX "chat_messages_rfq_id_created_at_idx" ON "chat_messages"("rfq_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "chat_messages_rfq_id_client_message_id_key" ON "chat_messages"("rfq_id", "client_message_id");

-- CreateIndex
CREATE INDEX "cbam_estimates_created_at_idx" ON "cbam_estimates"("created_at");

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_files" ADD CONSTRAINT "rfq_files_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_status_history" ADD CONSTRAINT "rfq_status_history_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_status_history" ADD CONSTRAINT "rfq_status_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_staff_user_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
