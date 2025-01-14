"use client";

import { Chess } from "chess.js";

interface CapturedPiecesProps {
  gameState: string;
  color: "white" | "black";
}

export function CapturedPieces({ gameState, color }: CapturedPiecesProps) {
  const game = new Chess(gameState);
  const board = game.board();
  
  // Count pieces on the board
  const piecesOnBoard = board.flat().filter(Boolean).reduce((acc, piece) => {
    const key = piece.color + piece.type;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Initial piece counts
  const initialPieces = {
    p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
  };

  // Calculate captured pieces
  const capturedPieces = Object.entries(initialPieces).flatMap(([type, count]) => {
    const pieceColor = color[0] as "w" | "b";
    const key = pieceColor + type;
    const remaining = piecesOnBoard[key] || 0;
    return Array(count - remaining).fill(type);
  });

  const getPieceSymbol = (type: string) => {
    const symbols: Record<string, string> = {
      p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚"
    };
    return color === "white" ? symbols[type].toUpperCase() : symbols[type];
  };

  return (
    <div className="flex gap-1 text-2xl h-8 items-center">
      {capturedPieces.map((type, index) => (
        <span key={index} className="opacity-50">
          {getPieceSymbol(type)}
        </span>
      ))}
    </div>
  );
} 