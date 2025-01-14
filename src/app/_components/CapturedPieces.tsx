"use client";

import { type Piece } from "chess.js";
import { motion } from "framer-motion";
import { getPieceImage } from "~/utils/chess";
import { getGameFromFen } from "~/utils/chess";

interface CapturedPiecesProps {
  gameState: string;
  color: "white" | "black";
}

export function CapturedPieces({ gameState, color }: CapturedPiecesProps) {
  const { board } = getGameFromFen(gameState);

  // Count pieces on the board
  const piecesOnBoard = board.flat().filter((piece): piece is Piece => piece !== null).reduce((acc, piece) => {
    const key = piece.color + piece.type;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Initial piece counts
  const initialPieces = {
    [`${color}p`]: 8, // pawns
    [`${color}n`]: 2, // knights
    [`${color}b`]: 2, // bishops
    [`${color}r`]: 2, // rooks
    [`${color}q`]: 1, // queen
  };

  // Calculate captured pieces
  const capturedPieces: Array<{ type: string; count: number }> = [];
  Object.entries(initialPieces).forEach(([key, initialCount]) => {
    const currentCount = piecesOnBoard[key] || 0;
    if (currentCount < initialCount) {
      capturedPieces.push({
        type: key[1],
        count: initialCount - currentCount,
      });
    }
  });

  if (capturedPieces.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 p-2 bg-black/20 rounded-lg"
    >
      {capturedPieces.map(({ type, count }) => (
        <div key={type} className="flex items-center">
          {Array.from({ length: count }).map((_, i) => (
            <motion.img
              key={i}
              src={getPieceImage(type, color)}
              alt={`Captured ${color} ${type}`}
              className="w-6 h-6 -ml-2 first:ml-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
} 