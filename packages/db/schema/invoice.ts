import { relations, sql } from "drizzle-orm";
import {
  date,
  float,
  int,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { clients } from "./client";

export const invoices = mySqlTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 128 }).notNull(),
  clientId: int("client_id").notNull(),
  userId: int("user_id").notNull(),
  totalAmount: float("total_amount").notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  dueDate: date("due_date").notNull(),
  issuedDate: date("issued_date").notNull(),
  logo: varchar("logo", { length: 256 }).notNull(),
  currency: varchar("currency", { length: 32 }).notNull(),
  subtotal: float("subtotal").notNull(),
  tax: float("tax").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const invoiceLineItems = mySqlTable("invoice_line_items", {
  id: serial("id").primaryKey(),
  invoiceId: int("invoice_id"),
  description: varchar("description", { length: 256 }).notNull(),
  amount: float("amount").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  lineItems: many(invoiceLineItems),
}));

export const invoiceLineItemRelations = relations(
  invoiceLineItems,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceLineItems.invoiceId],
      references: [invoices.id],
    }),
  }),
);
