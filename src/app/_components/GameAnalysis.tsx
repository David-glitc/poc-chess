"use client";

import { Chess } from "chess.js";
import { motion } from "framer-motion";

interface GameAnalysisProps {
  gameState: string;
}

export function GameAnalysis({ gameState }: GameAnalysisProps) {
  const game = new Chess();
  game.load(gameState);
  
  // Calculate material advantage
  const calculateMaterialPoints = () => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const board = game.board();
    let whitePoints = 0;
    let blackPoints = 0;

    board.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          const value = pieceValues[piece.type.toLowerCase() as keyof typeof pieceValues] || 0;
          if (piece.color === 'w') {
            whitePoints += value;
          } else {
            blackPoints += value;
          }
        }
      });
    });

    return { whitePoints, blackPoints };
  };

  // Analyze position
  const analyzePosition = () => {
    const { whitePoints, blackPoints } = calculateMaterialPoints();
    const advantage = whitePoints - blackPoints;
    
    let evaluation = "";
    if (game.isCheckmate()) {
      evaluation = game.turn() === 'w' ? "Black wins by checkmate" : "White wins by checkmate";
    } else if (game.isDraw()) {
      evaluation = "Draw position";
    } else if (game.isCheck()) {
      evaluation = `${game.turn() === 'w' ? "White" : "Black"} is in check`;
    } else if (Math.abs(advantage) >= 2) {
      evaluation = `${advantage > 0 ? "White" : "Black"} has material advantage`;
    } else {
      evaluation = "Equal position";
    }

    return {
      evaluation,
      advantage: Math.abs(advantage),
      advantageSide: advantage >= 0 ? "white" : "black"
    };
  };

  const { whitePoints, blackPoints } = calculateMaterialPoints();
  const analysis = analyzePosition();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg bg-black/50 rounded-lg p-4 shadow-lg border border-pink-500/20"
    >
      <div className="flex justify-between mb-4">
        <div className="text-white">
          <h3 className="font-semibold text-pink-200">White</h3>
          <p className="text-2xl">{whitePoints} pts</p>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            analysis.advantageSide === "white" ? "text-pink-300" : 
            analysis.advantageSide === "black" ? "text-pink-400" : "text-gray-400"
          }`}>
            {analysis.advantage > 0 ? `${analysis.advantage.toFixed(1)} advantage` : "Equal"}
          </div>
          <div className="text-sm text-pink-200/70">
            {analysis.evaluation}
          </div>
        </div>
        <div className="text-white text-right">
          <h3 className="font-semibold text-pink-200">Black</h3>
          <p className="text-2xl">{blackPoints} pts</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-pink-200/50">
          <span>Material</span>
          <span>{Math.abs(whitePoints - blackPoints)} point difference</span>
        </div>
        <div className="flex justify-between text-sm text-pink-200/50">
          <span>Position</span>
          <span>{game.isCheck() ? "Check" : game.moves().length + " possible moves"}</span>
        </div>
        <div className="flex justify-between text-sm text-pink-200/50">
          <span>Turn</span>
          <span>{game.turn() === 'w' ? "White to move" : "Black to move"}</span>
        </div>
      </div>
    </motion.div>
  );
} 