import { z } from "zod";

import { desc, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.string().min(1),
        clientId: z.number(),
        userId: z.number(),
        totalAmount: z.number(),
        status: z.string().min(1),
        dueDate: z.date(),
        issuedDate: z.date(),
        logo: z.string().min(1),
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
});
