import { z } from "zod";

import { desc, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        phone: z.string(),
        email: z.string(),
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
});
