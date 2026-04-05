import { CEFRLevel } from '@/types';

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function getLevelIndex(level: CEFRLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export function isLevelAtOrBelow(wordLevel: CEFRLevel, userLevel: CEFRLevel): boolean {
  return getLevelIndex(wordLevel) <= getLevelIndex(userLevel);
}

export function getNextLevel(level: CEFRLevel): CEFRLevel | null {
  const idx = getLevelIndex(level);
  return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
}

export function getLevelColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A1: '#22c55e', // green
    A2: '#84cc16', // lime
    B1: '#eab308', // yellow
    B2: '#f97316', // orange
    C1: '#ef4444', // red
    C2: '#a855f7', // purple
  };
  return colors[level];
}

export function getLevelLabel(level: CEFRLevel): string {
  const labels: Record<CEFRLevel, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficiency',
  };
  return labels[level];
}
