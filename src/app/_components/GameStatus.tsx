"use client";

import { Chess } from "chess.js";

interface GameStatusProps {
  gameState: string;
}

export function GameStatus({ gameState }: GameStatusProps) {
  const game = new Chess(gameState);
  
  const getStatusMessage = () => {
    if (game.isCheckmate()) return "Checkmate!";
    if (game.isDraw()) return "Draw!";
    if (game.isStalemate()) return "Stalemate!";
    if (game.isThreefoldRepetition()) return "Draw by repetition!";
    if (game.isInsufficientMaterial()) return "Draw by insufficient material!";
    if (game.isCheck()) return "Check!";
    return `${game.turn() === 'w' ? "White" : "Black"}'s turn`;
  };

  const getStatusColor = () => {
    if (game.isGameOver()) return "text-red-500";
    if (game.isCheck()) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-lg font-semibold ${getStatusColor()}`}>
        {getStatusMessage()}
      </div>
      {game.isGameOver() && (
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          New Game
        </button>
      )}
    </div>
  );
} 