
import { CEFRLevel } from '@/types';
import { getLevelColor } from '@/utils/cefrHelper';

interface CEFRBadgeProps {
  level: CEFRLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function CEFRBadge({ level, size = 'md' }: CEFRBadgeProps) {
  const color = getLevelColor(level);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {level}
    </div>
  );
}
