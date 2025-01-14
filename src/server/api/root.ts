import { createTRPCRouter } from "~/server/api/trpc";
import { chessRouter } from "~/server/api/routers/chess";

export const appRouter = createTRPCRouter({
  chess: chessRouter,
});

export type AppRouter = typeof appRouter;
