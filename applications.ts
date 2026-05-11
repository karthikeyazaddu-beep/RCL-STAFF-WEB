import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "declined",
  "blacklisted",
]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull(),
  username: text("username").notNull(),
  discriminator: text("discriminator"),
  avatar: text("avatar"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  role: text("role"),
  blacklistedUntil: timestamp("blacklisted_until", { withTimezone: true }),
  reviewedBy: text("reviewed_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
