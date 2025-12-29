'use client';

import { useState, useEffect } from 'react';
import { useValueSpiritStore } from '@/stores/valueSpiritStore';
import { getRandomMessage, SPIRIT_STAGES } from '@/data/spiritData';

interface ValueSpiritProps {
    onEvolve?: () => void;
}

export default function ValueSpirit({ onEvolve }: ValueSpiritProps) {
    const { habitCount, checkEvolution, acknowledgeEvolution, getCurrentStage, getProgress } = useValueSpiritStore();

    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isEvolving, setIsEvolving] = useState(false);

    const currentStage = getCurrentStage();
    const progress = getProgress();
    const isMaxStage = currentStage.id >= SPIRIT_STAGES.length;

    // 進化チェック
    useEffect(() => {
        if (checkEvolution()) {
            setIsEvolving(true);
            // 進化メッセージを表示
            const evolveMessage = getRandomMessage(currentStage.id, 'evolve');
            setMessage(evolveMessage || `${currentStage.name}に進化した！`);
            setShowMessage(true);

            setTimeout(() => {
                acknowledgeEvolution();
                setIsEvolving(false);
                setShowMessage(false);
                onEvolve?.();
            }, 3000);
        }
    }, [habitCount, checkEvolution, acknowledgeEvolution, currentStage, onEvolve]);

    // タップでメッセージ表示
    const handleTap = () => {
        if (isEvolving) return;

        const type = currentStage.id >= 3 ? 'celebrate' : 'greeting';
        const newMessage = getRandomMessage(currentStage.id, type);
        setMessage(newMessage);
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    };

    // 段階による色の強さ
    const glowIntensity = Math.min(0.3 + (currentStage.id * 0.1), 0.8);

    return (
        <div className="relative flex flex-col items-center">
            {/* 精霊本体 */}
            <button
                onClick={handleTap}
                className={`
                    relative w-24 h-24 rounded-full
                    transition-all duration-300 cursor-pointer
                    ${isEvolving ? 'animate-pulse scale-125' : 'hover:scale-110'}
                `}
                style={{
                    background: `radial-gradient(circle, rgba(255,180,80,${glowIntensity}) 0%, transparent 70%)`,
                    boxShadow: `0 0 ${30 + currentStage.id * 5}px rgba(255,180,80,${glowIntensity})`,
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <span
                    className={`text-5xl ${isEvolving ? 'animate-bounce' : ''}`}
                    style={{ lineHeight: 1 }}
                >
                    {currentStage.emoji}
                </span>

                {/* 進化エフェクト */}
                {isEvolving && (
                    <div className="absolute inset-0 rounded-full border-4 border-[var(--flame-glow)] animate-ping" />
                )}
            </button>

            {/* 精霊名 */}
            <p className="mt-3 text-lg font-bold text-[var(--flame-glow)]">
                {currentStage.name}
            </p>

            {/* 進捗表示 */}
            <div className="mt-1 flex flex-col items-center">
                <p className="text-sm text-gray-400">
                    Lv.{currentStage.id}/6
                </p>
                {!isMaxStage && (
                    <div className="mt-1 w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--flame-glow)] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* メッセージバブル */}
            {showMessage && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                    <div className={`
                        border rounded-xl px-4 py-2 text-sm shadow-lg
                        ${isEvolving
                            ? 'bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-yellow-500/50 text-yellow-200'
                            : 'bg-[var(--bg-surface)] border-[var(--flame-glow)]/30 text-gray-200'
                        }
                    `}>
                        {message}
                        <div className={`
                            absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 
                            ${isEvolving ? 'bg-orange-900/80 border-yellow-500/50' : 'bg-[var(--bg-surface)] border-[var(--flame-glow)]/30'}
                            border-r border-b
                        `} />
                    </div>
                </div>
            )}
        </div>
    );
}
