CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "storage";
--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" text PRIMARY KEY,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."invitation" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."member" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."organization" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage"."private_dimah_s3_settings" (
	"id" varchar(255) PRIMARY KEY,
	"version" varchar(255) DEFAULT '1.0.0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage"."storage_object" (
	"id" varchar(255) PRIMARY KEY,
	"scope" text NOT NULL,
	"bucket" text NOT NULL,
	"key" text NOT NULL,
	"content_type" text,
	"size" bigint,
	"e_tag" text,
	"filename" text,
	"status" text NOT NULL,
	"metadata" json,
	"acl" text,
	"upload_id" text,
	"declared_size" bigint,
	"confirmed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "auth"."account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "auth"."account" ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "auth"."invitation" ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "auth"."invitation" ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "auth"."member" ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "auth"."member" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "auth"."organization" ("slug");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "auth"."session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "auth"."verification" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "storage_object_bucket_key_uk" ON "storage"."storage_object" ("bucket","key");--> statement-breakpoint
CREATE INDEX "storage_object_scope_status_created_idx" ON "storage"."storage_object" ("scope","status","created_at");--> statement-breakpoint
CREATE INDEX "storage_object_status_expires_idx" ON "storage"."storage_object" ("status","expires_at");--> statement-breakpoint
CREATE INDEX "storage_object_status_created_idx" ON "storage"."storage_object" ("status","created_at");--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;