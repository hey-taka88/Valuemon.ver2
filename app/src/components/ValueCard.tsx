'use client';

import { ValueCard as ValueCardType } from '@/data/valuesData';

interface ValueCardProps {
    card: ValueCardType;
    isSelected?: boolean;
    isRanked?: boolean;
    rank?: number;
    onSelect?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showDescription?: boolean;
}

export default function ValueCard({
    card,
    isSelected = false,
    isRanked = false,
    rank,
    onSelect,
    size = 'md',
    showDescription = true,
}: ValueCardProps) {
    const sizeClasses = {
        sm: 'p-3 text-sm',
        md: 'p-4',
        lg: 'p-6 text-lg',
    };

    return (
        <div
            onClick={onSelect}
            className={`
        relative rounded-xl border-2 transition-all cursor-pointer
        ${sizeClasses[size]}
        ${isSelected
                    ? 'border-[var(--flame-glow)] bg-[var(--flame-glow)]/10 shadow-[0_0_15px_var(--flame-glow)]'
                    : 'border-white/10 bg-[var(--bg-card)] hover:border-white/30'
                }
        ${isRanked ? 'pl-12' : ''}
      `}
            style={{
                borderLeftColor: isSelected ? card.categoryColor : undefined,
                borderLeftWidth: isSelected ? '4px' : undefined,
            }}
        >
            {/* ランク表示 */}
            {isRanked && rank && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-xl font-bold"
                    style={{ color: card.categoryColor }}
                >
                    {rank}
                </div>
            )}

            {/* カテゴリバッジ */}
            <div
                className="inline-block px-2 py-0.5 rounded text-xs mb-2"
                style={{ backgroundColor: card.categoryColor + '30', color: card.categoryColor }}
            >
                {card.category === 'achievement' && '達成'}
                {card.category === 'relationship' && '関係'}
                {card.category === 'autonomy' && '自由'}
                {card.category === 'security' && '安全'}
                {card.category === 'pleasure' && '快楽'}
                {card.category === 'meaning' && '意味'}
                {card.category === 'power' && '力'}
                {card.category === 'tradition' && '伝統'}
            </div>

            {/* 価値観名 */}
            <h3 className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
                {card.name}
            </h3>

            {/* 説明 */}
            {showDescription && (
                <p className="text-gray-400 text-sm mt-1">
                    {card.description}
                </p>
            )}

            {/* 選択マーク */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--flame-glow)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                </div>
            )}
        </div>
    );
}
