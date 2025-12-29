'use client';

import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useState, useCallback } from 'react';

// ========================================
// ShadowCleanse - ドラッグで浄化する儀式化UI
// ========================================

interface ShadowCleanseProps {
    onCleanse: () => void;
    children: React.ReactNode;  // クレンジング後に表示するコンテンツ
}

export default function ShadowCleanse({ onCleanse, children }: ShadowCleanseProps) {
    const [cleansed, setCleansed] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);

    const x = useMotionValue(0);
    const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
    const scale = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8]);

    const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const progress = Math.min(Math.abs(info.offset.x) / 150, 1);
        setDragProgress(progress);
    }, []);

    const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500) {
            setCleansed(true);
            onCleanse();
        } else {
            setDragProgress(0);
        }
    }, [onCleanse]);

    if (cleansed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className="relative w-full h-64 overflow-hidden rounded-2xl">
            {/* 黒いモヤ背景 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/90 to-black/80"
                style={{ opacity }}
            >
                {/* モヤ粒子 */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gray-700/50"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(20px)',
                        }}
                        animate={{
                            x: [0, Math.random() * 30 - 15, 0],
                            y: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>

            {/* ドラッグ対象 */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing z-10"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{ x, scale }}
            >
                {/* 指示テキスト */}
                <motion.div
                    className="text-center"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <p className="text-2xl mb-2">👆</p>
                    <p className="text-white/80 font-medium">
                        こすって浄化
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                        横にスワイプして影を払う
                    </p>
                </motion.div>

                {/* プログレスバー */}
                <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)]"
                        style={{ width: `${dragProgress * 100}%` }}
                    />
                </div>
            </motion.div>

            {/* 光の演出（進捗に応じて） */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, rgba(255, 165, 0, ${dragProgress * 0.3}) 0%, transparent 70%)`,
                }}
            />
        </div>
    );
}

// ========================================
// QuickCleanse - 簡易浄化（長押し）
// ========================================

interface QuickCleanseProps {
    onCleanse: () => void;
    holdDuration?: number;  // ミリ秒
    className?: string;
}

export function QuickCleanse({
    onCleanse,
    holdDuration = 2000,
    className = '',
}: QuickCleanseProps) {
    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleStart = useCallback(() => {
        setHolding(true);
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(elapsed / holdDuration, 1);
            setProgress(newProgress);

            if (newProgress >= 1) {
                clearInterval(interval);
                onCleanse();
                setHolding(false);
                setProgress(0);
            }
        }, 50);

        const handleEnd = () => {
            clearInterval(interval);
            setHolding(false);
            setProgress(0);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };

        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
    }, [holdDuration, onCleanse]);

    return (
        <motion.button
            className={`relative overflow-hidden rounded-xl p-4 ${className}`}
            style={{
                background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-card))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            whileTap={{ scale: 0.98 }}
        >
            {/* プログレス背景 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)]"
                style={{
                    transformOrigin: 'left',
                    scaleX: progress,
                    opacity: 0.3,
                }}
            />

            {/* コンテンツ */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <motion.span
                    className="text-3xl"
                    animate={holding ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    🫁
                </motion.span>
                <span className="text-white font-medium">
                    {holding ? '深呼吸...' : '長押しで浄化'}
                </span>
                <span className="text-white/50 text-xs">
                    {Math.round(holdDuration / 1000)}秒間ホールド
                </span>
            </div>
        </motion.button>
    );
}
