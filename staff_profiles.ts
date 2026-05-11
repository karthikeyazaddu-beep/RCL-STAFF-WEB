import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffProfilesTable = pgTable("staff_profiles", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  timezone: text("timezone"),
  about: text("about"),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStaffProfileSchema = createInsertSchema(staffProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStaffProfile = z.infer<typeof insertStaffProfileSchema>;
export type StaffProfile = typeof staffProfilesTable.$inferSelect;
