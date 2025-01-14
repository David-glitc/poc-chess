"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from "nanoid";

export function GameCreation() {
  const router = useRouter();
  const [gameId, setGameId] = useState("");

  const handleCreateGame = () => {
    const newGameId = nanoid(10);
    router.push(`/game/${newGameId}`);
  };

  const handleJoinGame = () => {
    if (gameId.trim()) {
      router.push(`/game/${gameId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleCreateGame}
          className="px-8 py-4 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Game
        </button>
      </div>

      <div className="text-center">
        <p className="text-lg mb-4">Or join an existing game</p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter game ID"
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleJoinGame();
              }
            }}
          />
          <button
            onClick={handleJoinGame}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
} 