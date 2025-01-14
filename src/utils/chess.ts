import { Chess, type Piece, type Square, type PieceSymbol, type Color } from "chess.js";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

interface GameState {
  board: (Piece | null)[][];
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
}

function createGameState(game: Chess): GameState {
  return {
    board: game.board(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
  };
}

export function getGameFromFen(fen: string): GameState {
  try {
    return createGameState(new Chess(fen));
  } catch {
    // Return default starting position if FEN is invalid
    return createGameState(new Chess(DEFAULT_FEN));
  }
}

export function getPieceImage(type: PieceSymbol, color: Color): string {
  return `/pieces/${color}-${type}.svg`;
} 