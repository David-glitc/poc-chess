import { Chess } from 'chess.js';

export const isMoveValid = (gameState: string, move: { from: string; to: string }): string | null => {
  try {
    const game = new Chess(gameState);
    // Try to make the move
    const result = game.move({ from: move.from, to: move.to, promotion: 'q' });
    return result ? game.fen() : null;
  } catch (error) {
    console.error('Invalid move or game state:', error);
    return null;
  }
};

export const getInitialPosition = (): string => {
  return new Chess().fen();
};

export const isGameOver = (gameState: string): boolean => {
  try {
    const game = new Chess(gameState);
    return game.isGameOver();
  } catch {
    return false;
  }
}; 