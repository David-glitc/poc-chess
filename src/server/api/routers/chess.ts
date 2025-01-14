import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getInitialPosition, isMoveValid } from "~/utils/chessUtils";

// Mocked game state storage (replace with DB in production)
const games = new Map<string, string>();

export const chessRouter = createTRPCRouter({
  createGame: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(({ input }) => {
      try {
        const initialPosition = getInitialPosition();
        games.set(input.roomId, initialPosition);
        return { gameState: initialPosition };
      } catch (error) {
        throw new Error("Failed to create game");
      }
    }),

  getGameState: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(({ input }) => {
      try {
        const gameState = games.get(input.roomId);
        if (!gameState) {
          throw new Error("Game not found");
        }
        return { gameState };
      } catch (error) {
        throw new Error("Failed to get game state");
      }
    }),

  move: publicProcedure
    .input(z.object({ 
      roomId: z.string(),
      from: z.string(),
      to: z.string()
    }))
    .mutation(({ input }) => {
      try {
        const currentState = games.get(input.roomId);
        if (!currentState) {
          throw new Error("Game not found");
        }

        const newState = isMoveValid(currentState, { from: input.from, to: input.to });
        if (!newState) {
          throw new Error("Invalid move");
        }

        games.set(input.roomId, newState);
        return { gameState: newState };
      } catch (error) {
        throw new Error("Failed to make move");
      }
    }),
}); 