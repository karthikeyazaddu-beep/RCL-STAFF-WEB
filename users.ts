import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("role", [
  "owner",
  "hicom",
  "head_mod",
  "senior_mod",
  "moderator",
  "trial_mod",
  "none",
]);

export const statusEnum = pgEnum("user_status", [
  "approved",
  "pending",
  "declined",
  "blacklisted",
  "none",
]);

export const usersTable = pgTable("users", {
  discordId: text("discord_id").primaryKey(),
  username: text("username").notNull(),
  discriminator: text("discriminator"),
  avatar: text("avatar"),
  role: roleEnum("role").notNull().default("none"),
  status: statusEnum("status").notNull().default("none"),
  blacklistedUntil: timestamp("blacklisted_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
