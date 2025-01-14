"use client";

import { type Piece, type Color, type PieceSymbol } from "chess.js";
import { motion } from "framer-motion";
import { getPieceImage, getGameFromFen } from "../../utils/chess";

interface CapturedPiecesProps {
  gameState: string;
  color: Color;
}

type PieceKey = `${Color}${PieceSymbol}`;

export function CapturedPieces({ gameState, color }: CapturedPiecesProps) {
  const { board } = getGameFromFen(gameState);

  // Count pieces on the board
  const piecesOnBoard = board.flat().filter((piece): piece is Piece => piece !== null).reduce<Record<PieceKey, number>>((acc, piece) => {
    const key: PieceKey = `${piece.color}${piece.type}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<PieceKey, number>);

  // Initial piece counts
  const initialPieces: Record<PieceKey, number> = {
    [`${color}p`]: 8, // pawns
    [`${color}n`]: 2, // knights
    [`${color}b`]: 2, // bishops
    [`${color}r`]: 2, // rooks
    [`${color}q`]: 1, // queen
  } as Record<PieceKey, number>;

  // Calculate captured pieces
  const capturedPieces: Array<{ type: PieceSymbol; count: number }> = [];
  Object.entries(initialPieces).forEach(([key, initialCount]) => {
    const currentCount = piecesOnBoard[key as PieceKey] || 0;
    if (currentCount < initialCount) {
      capturedPieces.push({
        type: key.charAt(1) as PieceSymbol,
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