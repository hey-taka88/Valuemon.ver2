'use client';

import { useState, useEffect } from 'react';
import { useHabitStore } from '@/stores/habitStore';
import { getVariantById, getMonsterStage, getMonsterProgress, getThemeColors } from '@/data/monsterVariants';

interface HabitMonsterProps {
    compact?: boolean;
    onTap?: () => void;
}

export default function HabitMonster({ compact = false, onTap }: HabitMonsterProps) {
    const { currentHabit, monsterVariantId, totalCompletions } = useHabitStore();

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [prevLevel, setPrevLevel] = useState(1);
    const [isEvolving, setIsEvolving] = useState(false);

    // モンスター情報
    const variant = monsterVariantId ? getVariantById(monsterVariantId) : null;
    const currentStage = variant ? getMonsterStage(variant, totalCompletions) : null;
    const progress = variant ? getMonsterProgress(variant, totalCompletions) : 0;
    const colors = variant ? getThemeColors(variant.theme) : { primary: 'rgba(150,150,150,0.5)', glow: 'rgba(100,100,100,0.3)' };

    // 進化チェック
    useEffect(() => {
        if (currentStage && currentStage.level > prevLevel) {
            setIsEvolving(true);
            setMessage(`${currentStage.name}に進化！`);
            setShowMessage(true);

            setTimeout(() => {
                setIsEvolving(false);
                setShowMessage(false);
                setPrevLevel(currentStage.level);
            }, 3000);
        } else if (currentStage) {
            setPrevLevel(currentStage.level);
        }
    }, [currentStage, prevLevel]);

    // タップでメッセージ表示
    const handleTap = () => {
        if (!currentStage || isEvolving) return;

        const messages = [
            '頑張ってるね！',
            '一緒に成長しよう',
            `Lv.${currentStage.level}まで来たね！`,
            '今日も応援してる',
        ];
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowMessage(true);

        setTimeout(() => setShowMessage(false), 2500);
        onTap?.();
    };

    // 習慣未設定時
    if (!currentHabit || !variant || !currentStage) {
        return null;
    }

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStage.emoji}</span>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-300">{currentStage.name}</p>
                    <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500"
                            style={{ width: `${progress}%`, backgroundColor: colors.glow }}
                        />
                    </div>
                </div>
                <span className="text-xs text-gray-500">Lv.{currentStage.level}</span>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center">
            {/* モンスター本体 */}
            <button
                onClick={handleTap}
                className={`
                    relative w-20 h-20 rounded-full
                    transition-all duration-300 cursor-pointer
                    ${isEvolving ? 'animate-pulse scale-125' : 'hover:scale-110'}
                `}
                style={{
                    background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                    boxShadow: `0 0 30px ${colors.glow}`,
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <span
                    className={`text-4xl ${isEvolving ? 'animate-bounce' : ''}`}
                    style={{ lineHeight: 1 }}
                >
                    {currentStage.emoji}
                </span>

                {isEvolving && (
                    <div
                        className="absolute inset-0 rounded-full border-4 animate-ping"
                        style={{ borderColor: colors.glow }}
                    />
                )}
            </button>

            {/* 名前と進捗 */}
            <p className="mt-2 text-sm font-bold" style={{ color: colors.glow }}>
                {currentStage.name}
            </p>
            <p className="text-xs text-gray-400">
                Lv.{currentStage.level}/6
            </p>

            {/* 進捗バー */}
            {currentStage.level < 6 && (
                <div className="mt-1 w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: colors.glow }}
                    />
                </div>
            )}

            {/* メッセージ */}
            {showMessage && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                    <div
                        className="border rounded-xl px-3 py-1.5 text-sm shadow-lg"
                        style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: colors.glow,
                            color: isEvolving ? colors.glow : 'white'
                        }}
                    >
                        {message}
                    </div>
                </div>
            )}
        </div>
    );
}
