import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as auth from "./schema/auth";
import * as client from "./schema/client";
import * as invoice from "./schema/invoice";
import * as post from "./schema/post";
import * as user from "./schema/user";

export const schema = { ...auth, ...post, ...invoice, ...client, ...user };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    url: process.env.DATABASE_URL,
  }).connection(),
  { schema },
);
