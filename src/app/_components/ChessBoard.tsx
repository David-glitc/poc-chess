"use client";

import { useState } from "react";
import { Chess } from "chess.js";

interface ChessBoardProps {
  gameState: string;
  onMove: (from: string, to: string) => void;
}

export function ChessBoard({ gameState, onMove }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const game = new Chess(gameState);

  const handleSquareClick = (square: string) => {
    if (selectedSquare === null) {
      // First click - select the piece if it exists and show possible moves
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        // Get possible moves for the selected piece
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
      }
    } else {
      // Second click - attempt to move
      onMove(selectedSquare, square);
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const getPieceSymbol = (piece: any) => {
    if (!piece) return "";
    const symbols: Record<string, string> = {
      p: "♟", P: "♙",
      n: "♞", N: "♘",
      b: "♝", B: "♗",
      r: "♜", R: "♖",
      q: "♛", Q: "♕",
      k: "♚", K: "♔"
    };
    return symbols[piece.type.toUpperCase() + (piece.color === "w" ? "" : "").toLowerCase()];
  };

  const getSquareClasses = (square: string, isDark: boolean, piece: any) => {
    const isSelected = square === selectedSquare;
    const isPossibleMove = possibleMoves.includes(square);
    const isCheck = piece?.type === 'k' && 
                   piece?.color === game.turn() && 
                   game.isCheck();

    return `
      aspect-square flex items-center justify-center text-4xl
      relative cursor-pointer
      ${isDark ? "bg-gray-400" : "bg-gray-200"}
      ${isSelected ? "ring-2 ring-blue-500" : ""}
      ${isPossibleMove ? "after:absolute after:w-3 after:h-3 after:bg-blue-500/50 after:rounded-full" : ""}
      ${isCheck ? "bg-red-400" : ""}
      hover:opacity-90 transition-all
      ${piece ? "hover:scale-105" : ""}
    `;
  };

  // Add coordinate labels
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative">
      {/* Rank labels (left side) */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-sm">
        {ranks.map(rank => (
          <div key={rank} className="flex items-center">{rank}</div>
        ))}
      </div>

      {/* File labels (bottom) */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-sm">
        {files.map(file => (
          <div key={file}>{file}</div>
        ))}
      </div>

      {/* Board */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="aspect-square grid grid-cols-8 border-2 border-gray-700 shadow-lg">
          {game.board().flatMap((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const square = String.fromCharCode(97 + colIndex) + (8 - rowIndex);
              const isDark = (rowIndex + colIndex) % 2 === 1;

              return (
                <button
                  key={square}
                  className={getSquareClasses(square, isDark, piece)}
                  onClick={() => handleSquareClick(square)}
                >
                  {getPieceSymbol(piece)}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 