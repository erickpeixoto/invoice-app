/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        invoiceNumber: z.string().min(1),
        clientId: z.number(),
        userId: z.number(),
        authId: z.string().min(1),
        totalAmount: z.number(),
        status: z.string().min(1),
        dueDate: z.date(),
        issuedDate: z.date(),
        logo: z.string(),
        currency: z.string().min(1),
        subtotal: z.number(),
        tax: z.number(),
        lineItems: z.array(
          z.object({
            invoiceId: z.number().optional(),
            description: z.string().min(1),
            amount: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Insert the main invoice and get its ID
      const invoiceResult = await ctx.db.insert(schema.invoices).values(input);
      const invoiceId = invoiceResult.insertId;

      // Insert each lineItem into the invoice_line_items table
      for (const lineItem of input.lineItems) {
        await ctx.db.insert(schema.invoiceLineItems).values({
          invoiceId,
          description: lineItem.description,
          amount: lineItem.amount,
        } as unknown as {
          invoiceId: number;
          description: string;
          amount: number;
        });
      }

      const newInvoice = await ctx.db.query.invoices.findFirst({
        with: {
          client: true,
          lineItems: true,
        },
      });

      return newInvoice;
    }),

  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.invoices.findMany({
      with: {
        client: true,
        lineItems: true, // Added lineItems
      },
    });
  }),
  latest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.invoices.findFirst({
      orderBy: desc(schema.invoices.id),
    });
  }),
  dashboard: publicProcedure
    .input(
      z.object({
        authId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { authId } = input;

      const allInvoicesForUser = await ctx.db.query.invoices.findMany({
        where: eq(schema.invoices.authId, authId),
      });

      const totalAmount = allInvoicesForUser.reduce(
        (sum: any, invoice: { totalAmount: any }) => sum + invoice.totalAmount,
        0,
      );

      const statusCounts = {
        paid: allInvoicesForUser.filter(
          (invoice: { status: string }) => invoice.status === "Paid",
        ).length,
        pending: allInvoicesForUser.filter(
          (invoice: { status: string }) => invoice.status === "Pending",
        ).length,
        overdue: allInvoicesForUser.filter(
          (invoice: { status: string }) => invoice.status === "Overdue",
        ).length,
      };

      const invoicesWithRelations = await ctx.db.query.invoices.findMany({
        where: eq(schema.invoices.authId, authId),
        with: {
          client: true,
          lineItems: true,
          user: true,
        },
      });

      return {
        totalAmount,
        statusCounts,
        invoices: invoicesWithRelations,
      };
    }),
  delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.invoices).where(eq(schema.invoices.id, input));
  }),
  selected: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.invoices.findMany({
        where: eq(schema.invoices.id, input.id),
        with: {
          client: true,
          lineItems: true,
          user: true,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        invoiceNumber: z.string(),
        clientId: z.number(),
        userId: z.number(),
        authId: z.string(),
        totalAmount: z.number(),
        status: z.string(),
        dueDate: z.date(),
        issuedDate: z.date(),
        logo: z.string(),
        currency: z.string(),
        subtotal: z.number(),
        tax: z.number(),
        lineItems: z.array(
          z.object({
            id: z.number().optional(),
            invoiceId: z.number().optional(),
            description: z.string(),
            amount: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, lineItems, ...rest } = input;

      // Update the main invoice data
      const updatedInvoice = await ctx.db
        .update(schema.invoices)
        .set(rest)
        .where(eq(schema.invoices.id, id));

      if (!updatedInvoice) {
        throw new Error("Failed to update invoice");
      }

      // Fetch the current line items associated with the invoice
      const currentLineItems = await ctx.db.query.invoiceLineItems.findMany({
        where: eq(schema.invoiceLineItems.invoiceId, id),
      });

      // Update or create line items
      for (const lineItem of lineItems) {
        if (lineItem.id) {
          await ctx.db
            .update(schema.invoiceLineItems)
            .set(lineItem)
            .where(eq(schema.invoiceLineItems.id, lineItem.id));
        } else {
          await ctx.db.insert(schema.invoiceLineItems).values({
            ...lineItem,
            invoiceId: id,
          });
        }
      }

      // Delete line items that are not in the input
      for (const currentLineItem of currentLineItems) {
        if (!lineItems.some((li) => li.id === currentLineItem.id)) {
          await ctx.db
            .delete(schema.invoiceLineItems)
            .where(eq(schema.invoiceLineItems.id, currentLineItem.id));
        }
      }

      // fetch the updated invoice with line items and return it
      const updatedInvoiceWithItems = await ctx.db.query.invoices.findFirst({
        where: eq(schema.invoices.id, id),
        with: {
          lineItems: true,
        },
      });

      return updatedInvoiceWithItems;
    }),
});
