import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const botContextTable = pgTable("bot_context", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBotContextSchema = createInsertSchema(botContextTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBotContext = z.infer<typeof insertBotContextSchema>;
export type BotContext = typeof botContextTable.$inferSelect;
