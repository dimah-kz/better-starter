/**
 * dimah-s3 / FumaDB tables (PostgreSQL schema `storage`, not `public`).
 * Shape matches `@dimah-s3/db` v1 + recommended secondary indexes.
 *
 * @see https://dimah-s3.vercel.app/docs/db/setup
 */
import { createId } from "@paralleldrive/cuid2"
import { defineRelationsPart } from "drizzle-orm"
import {
  bigint,
  index,
  json,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"

/** PostgreSQL schema for dimah-s3 tables (not `public`). */
export const storagePg = pgSchema("storage")

export const storageObject = storagePg.table(
  "storage_object",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    scope: text("scope").notNull(),
    bucket: text("bucket").notNull(),
    key: text("key").notNull(),
    contentType: text("content_type"),
    size: bigint("size", { mode: "bigint" }),
    eTag: text("e_tag"),
    filename: text("filename"),
    status: text("status").notNull(),
    metadata: json("metadata"),
    acl: text("acl"),
    uploadId: text("upload_id"),
    declaredSize: bigint("declared_size", { mode: "bigint" }),
    confirmedAt: timestamp("confirmed_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("storage_object_bucket_key_uk").on(table.bucket, table.key),
    index("storage_object_scope_status_created_idx").on(
      table.scope,
      table.status,
      table.createdAt
    ),
    index("storage_object_status_expires_idx").on(
      table.status,
      table.expiresAt
    ),
    index("storage_object_status_created_idx").on(
      table.status,
      table.createdAt
    ),
  ]
)

/** FumaDB settings row — emitted by CLI alongside `storage_object`. */
export const private_dimah_s3_settings = storagePg.table(
  "private_dimah_s3_settings",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    version: varchar("version", { length: 255 }).notNull().default("1.0.0"),
  }
)

/** Registers storage tables for Drizzle RQB / FumaDB — no cross-schema relations. */
export const storageRelations = defineRelationsPart({
  storageObject,
  private_dimah_s3_settings,
})
