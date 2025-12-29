'use client';

import React from 'react';

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    colorClass?: string;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
};

export default function ProgressBar({
    current,
    max,
    label,
    colorClass = 'bg-amber-500',
    showValue = true,
    size = 'md',
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const heightClass = SIZE_CONFIG[size];

    return (
        <div className="w-full space-y-1">
            {/* ラベルと値 */}
            {(label || showValue) && (
                <div className="flex justify-between text-xs font-bold tracking-widest text-slate-300 uppercase">
                    <span>{label}</span>
                    {showValue && <span>{current} / {max}</span>}
                </div>
            )}

            {/* バーの外枠 */}
            <div
                className={`
                    ${heightClass} w-full rounded-full 
                    bg-slate-900/80 border border-slate-700/50 
                    backdrop-blur-sm relative overflow-hidden shadow-inner
                `}
            >
                {/* 進行バー */}
                <div
                    className={`h-full transition-all duration-700 ease-out relative ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                >
                    {/* 光沢エフェクト（上半分） */}
                    <div className="absolute top-0 left-0 w-full h-[50%] bg-white/30" />

                    {/* 右端の輝き */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
                </div>
            </div>
        </div>
    );
}
