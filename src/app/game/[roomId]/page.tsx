"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChessBoard } from "~/app/_components/ChessBoard";
import { CapturedPieces } from "~/app/_components/CapturedPieces";
import { GameStatus } from "~/app/_components/GameStatus";
import { GameAnalysis } from "~/app/_components/GameAnalysis";
import { MoveHistory } from "~/app/_components/MoveHistory";
import { ConnectionStatus } from "~/app/_components/ConnectionStatus";
import { createSocket } from "~/utils/socket";
import { api } from "~/trpc/react";

export default function GamePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<string | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [socket] = useState(createSocket);
  const utils = api.useUtils();
  const createGameMutation = api.chess.createGame.useMutation();

  // Initialize or get game state
  const { data: gameData } = api.chess.getGameState.useQuery(
    { roomId },
    {
      retry: (failureCount, error) => {
        if (error.message === "Game not found" && failureCount === 0) {
          void createGameMutation.mutate({ roomId });
          return true;
        }
        return false;
      },
      retryDelay: 1000,
    }
  );

  const moveMutation = api.chess.move.useMutation({
    onSuccess: (data) => {
      socket.emit("move", {
        room: roomId,
        state: data.gameState,
      });
      // Reset to latest position after making a move
      setCurrentPosition(null);
      setCurrentMoveIndex(-1);
    },
  });

  useEffect(() => {
    socket.connect();
    socket.emit("join-room", roomId);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("move", (data: { state: string }) => {
      utils.chess.getGameState.setData(
        { roomId },
        { gameState: data.state }
      );
      // Reset to latest position after receiving a move
      setCurrentPosition(null);
      setCurrentMoveIndex(-1);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, socket, utils.chess.getGameState]);

  const handleMove = (from: string, to: string) => {
    // Only allow moves when viewing the latest position
    if (!currentPosition) {
      moveMutation.mutate({
        roomId,
        from,
        to,
      });
    }
  };

  const handleNavigateToMove = (position: string, index: number) => {
    setCurrentPosition(position);
    setCurrentMoveIndex(index);
  };

  if (!gameData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"
        />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">
            Chess Game
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-xl text-pink-200">
              Room: {roomId}
            </div>
            <ConnectionStatus socket={socket} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-4"
          >
            <GameAnalysis gameState={currentPosition ?? gameData.gameState} />
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                New Game
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Share
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <div className="flex flex-col items-center gap-4">
              <CapturedPieces gameState={currentPosition ?? gameData.gameState} color="black" />
              <motion.div
                layout
                className="relative bg-black p-8 rounded-xl shadow-2xl border border-pink-500/20"
              >
                <ChessBoard
                  gameState={currentPosition ?? gameData.gameState}
                  onMove={handleMove}
                />
                {currentPosition && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentPosition(null);
                        setCurrentMoveIndex(-1);
                      }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Return to Game
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
              <CapturedPieces gameState={currentPosition ?? gameData.gameState} color="white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-4"
          >
            <MoveHistory
              gameState={gameData.gameState}
              onNavigateToMove={handleNavigateToMove}
              currentMoveIndex={currentMoveIndex}
            />
            <GameStatus gameState={currentPosition ?? gameData.gameState} />
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
} 