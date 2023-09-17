import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        phone: z.string(),
        email: z.string().email(),
        profile: z.string(),
        authId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newClient = await ctx.db.insert(schema.clients).values(input);

      return newClient;
    }),

  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.clients.findMany({
      orderBy: desc(schema.clients.id),
    });
  }),
  selected: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.clients.findMany({
        where: eq(schema.clients.id, input.id),
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        phone: z.string(),
        email: z.string(),
        profile: z.string(),
        authId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedClient = await ctx.db
        .update(schema.clients)
        .set({
          name: input.name,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          phoneNumber: input.phone,
          email: input.email,
          profile: input.profile || "",
          authId: input.authId,
        })
        .where(eq(schema.clients.id, input.id));
      console.log(input);
      if (!updatedClient) {
        throw new Error("Failed to update client");
      }
    }),
});
