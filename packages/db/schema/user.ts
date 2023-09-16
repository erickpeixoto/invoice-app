import { relations, sql } from "drizzle-orm";
import { serial, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { clients } from "./client";
import { invoices } from "./invoice";

export const users = mySqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 128 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  invoices: many(invoices),
  clients: many(clients),
}));
