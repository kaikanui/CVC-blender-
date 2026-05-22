/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordItem {
  id: string;
  word: string;
  clue?: string[];
  clues?: string[]; // Phonetic breakout, e.g. ["c", "a", "t"]
  category: 'cvc' | 'blend' | 'digraph' | 'advanced' | 'heart';
  emoji: string;
  distractors: string[]; // Other words from the same level
  heartParts?: number[]; // Indices of irregular letters for heart words (pink heart visualization)
  hint?: string;
  syllables?: string[]; // e.g. ["play", "ground"] or ["rab", "bit"]
}

export type GameLevel = 1 | 2 | 3 | 4 | 'heart' | 'first-sound';

export interface GameState {
  currentLevel: GameLevel;
  score: number;
  streak: number;
  currentWordItem: WordItem | null;
  choices: WordItem[];
  selectedIndex: number | null;
  isCorrect: boolean | null;
  cameraActive: boolean;
  trackingMode: 'finger' | 'touch';
}
