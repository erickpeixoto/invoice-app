import { authRouter } from "./router/auth";
import { clientRouter } from "./router/client";
import { invoiceRouter } from "./router/invoice";
import { postRouter } from "./router/post";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  invoice: invoiceRouter,
  costumer: clientRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
