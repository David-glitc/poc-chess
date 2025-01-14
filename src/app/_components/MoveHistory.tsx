"use client";

import { Chess } from "chess.js";
import { motion } from "framer-motion";

interface MoveHistoryProps {
  gameState: string;
  onNavigateToMove?: (fen: string, index: number) => void;
  currentMoveIndex?: number;
}

export function MoveHistory({ gameState, onNavigateToMove, currentMoveIndex = -1 }: MoveHistoryProps) {
  const game = new Chess();
  game.load(gameState);
  
  const moves = game.history({ verbose: true });
  const positions = [new Chess().fen()];
  
  // Replay the game to get all positions
  const replayGame = new Chess();
  moves.forEach(move => {
    replayGame.move(move);
    positions.push(replayGame.fen());
  });

  const getMoveQuality = (move: string) => {
    if (move.includes('#')) return { label: "Checkmate", class: "text-pink-400" };
    if (move.includes('+')) return { label: "Check", class: "text-pink-300" };
    if (move.includes('x')) return { label: "Capture", class: "text-pink-200" };
    if (move.includes('=')) return { label: "Promotion", class: "text-pink-300" };
    if (move.includes('O-O')) return { label: "Castle", class: "text-pink-200" };
    return { label: "Move", class: "text-gray-400" };
  };

  const moveHistory = [];
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    
    moveHistory.push({
      number: moveNumber,
      white: whiteMove ? {
        san: whiteMove.san,
        index: i,
        quality: getMoveQuality(whiteMove.san)
      } : null,
      black: blackMove ? {
        san: blackMove.san,
        index: i + 1,
        quality: getMoveQuality(blackMove.san)
      } : null
    });
  }

  const handleMoveClick = (index: number) => {
    if (onNavigateToMove) {
      onNavigateToMove(positions[index + 1], index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg bg-black/50 rounded-lg p-4 shadow-lg border border-pink-500/20"
    >
      <h3 className="text-lg font-semibold text-pink-400 mb-4">Move History</h3>
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
        {moveHistory.map((move) => (
          <div key={move.number} className="flex items-center gap-2 py-1">
            <span className="text-pink-500/50 w-8 text-sm">{move.number}.</span>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {move.white && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoveClick(move.white!.index)}
                  className={`flex items-center gap-2 px-2 py-1 rounded ${
                    currentMoveIndex === move.white.index ? 'bg-pink-500/20' : 'hover:bg-pink-500/10'
                  }`}
                >
                  <span className="text-white font-mono">{move.white.san}</span>
                  <span className={`text-xs ${move.white.quality.class}`}>
                    {move.white.quality.label}
                  </span>
                </motion.button>
              )}
              {move.black && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoveClick(move.black!.index)}
                  className={`flex items-center gap-2 px-2 py-1 rounded ${
                    currentMoveIndex === move.black.index ? 'bg-pink-500/20' : 'hover:bg-pink-500/10'
                  }`}
                >
                  <span className="text-white font-mono">{move.black.san}</span>
                  <span className={`text-xs ${move.black.quality.class}`}>
                    {move.black.quality.label}
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between mt-4 pt-4 border-t border-pink-500/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleMoveClick(-1)}
          className="px-3 py-1 text-sm bg-pink-500/10 rounded hover:bg-pink-500/20 text-pink-200"
          disabled={currentMoveIndex === -1}
        >
          Start
        </motion.button>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoveClick(currentMoveIndex - 1)}
            className="px-3 py-1 text-sm bg-pink-500/10 rounded hover:bg-pink-500/20 text-pink-200"
            disabled={currentMoveIndex <= -1}
          >
            ←
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoveClick(currentMoveIndex + 1)}
            className="px-3 py-1 text-sm bg-pink-500/10 rounded hover:bg-pink-500/20 text-pink-200"
            disabled={currentMoveIndex >= moves.length - 1}
          >
            →
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleMoveClick(moves.length - 1)}
          className="px-3 py-1 text-sm bg-pink-500/10 rounded hover:bg-pink-500/20 text-pink-200"
          disabled={currentMoveIndex === moves.length - 1}
        >
          Latest
        </motion.button>
      </div>
    </motion.div>
  );
} 