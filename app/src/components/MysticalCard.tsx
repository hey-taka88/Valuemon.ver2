'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// ========================================
// MysticalCard - Glassmorphism + Glow Border
// ========================================

interface MysticalCardProps {
    children: React.ReactNode;
    glowColor?: 'blue' | 'gold' | 'fire' | 'none';
    onClick?: () => void;
    className?: string;
    animated?: boolean;
}

const GLOW_STYLES = {
    blue: {
        borderColor: 'rgba(0, 212, 255, 0.5)',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
        hoverShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
    },
    gold: {
        borderColor: 'rgba(255, 215, 0, 0.5)',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
        hoverShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
    },
    fire: {
        borderColor: 'rgba(255, 107, 53, 0.5)',
        boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
        hoverShadow: '0 0 30px rgba(255, 107, 53, 0.6)',
    },
    none: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: 'none',
        hoverShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
    },
};

export default function MysticalCard({
    children,
    glowColor = 'none',
    onClick,
    className = '',
    animated = true,
}: MysticalCardProps) {
    const glowStyle = GLOW_STYLES[glowColor];

    const cardContent = (
        <div
            className={`
                bg-[rgba(26,26,46,0.8)]
                backdrop-blur-md
                rounded-2xl
                p-6
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
            style={{
                border: `1px solid ${glowStyle.borderColor}`,
                boxShadow: glowStyle.boxShadow,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );

    if (!animated) {
        return cardContent;
    }

    return (
        <motion.div
            whileHover={onClick ? {
                scale: 1.02,
                boxShadow: glowStyle.hoverShadow,
            } : {}}
            whileTap={onClick ? { scale: 0.98 } : {}}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
            }}
        >
            {cardContent}
        </motion.div>
    );
}

// ========================================
// AnimatedContainer - ページ遷移アニメーション
// ========================================

interface AnimatedContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedContainer({ children, className = '' }: AnimatedContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ========================================
// FadeInList - リストアイテムの順次フェードイン
// ========================================

interface FadeInListProps {
    children: React.ReactNode[];
    staggerDelay?: number;
}

export function FadeInList({ children, staggerDelay = 0.1 }: FadeInListProps) {
    return (
        <AnimatePresence>
            {children.map((child, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: index * staggerDelay,
                        duration: 0.3,
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </AnimatePresence>
    );
}
