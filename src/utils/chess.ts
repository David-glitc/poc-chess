import { Chess } from "chess.js";

export function getGameFromFen(fen: string) {
  const game = new Chess(fen);
  return {
    board: game.board(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
  };
}

export function getPieceImage(type: string, color: string): string {
  return `/pieces/${color}-${type}.svg`;
} 