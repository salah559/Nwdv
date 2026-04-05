import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  image: z.string().url("Must be a valid image URL"),
  link: z.string().url("Must be a valid project URL"),
  createdAt: z.any().optional(),
  isFavorite: z.boolean().default(false).optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Contact Message Schema
export const contactMessageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  createdAt: z.any().optional(),
  status: z.enum(["unread", "read"]).default("unread"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

// Admin Settings Schema
export const adminSettingsSchema = z.object({
  id: z.string().optional(),
  adminCode: z.string().min(4, "Admin code must be at least 4 characters"),
  lastUpdated: z.any().optional(),
});

export type AdminSettings = z.infer<typeof adminSettingsSchema>;
