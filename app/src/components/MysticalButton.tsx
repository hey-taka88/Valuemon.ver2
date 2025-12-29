'use client';

import { motion } from 'framer-motion';
import React from 'react';

// ========================================
// MysticalButton - Juice Factor対応ボタン
// 押下時にScale 0.95に縮むアニメーション
// ========================================

interface MysticalButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    glowColor?: 'fire' | 'blue' | 'gold';
}

const GLOW_COLORS = {
    fire: 'rgba(255, 107, 53, 0.6)',
    blue: 'rgba(0, 212, 255, 0.6)',
    gold: 'rgba(255, 215, 0, 0.6)',
};

const VARIANT_STYLES = {
    primary: 'bg-gradient-to-r from-[var(--flame-core)] to-[var(--flame-ember)] text-white',
    secondary: 'bg-[var(--bg-surface)] border border-white/20 text-white',
    ghost: 'bg-transparent text-[var(--flame-glow)] hover:bg-white/5',
};

const SIZE_STYLES = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
};

export default function MysticalButton({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    size = 'md',
    className = '',
    glowColor = 'fire',
}: MysticalButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`
                rounded-xl font-semibold
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${VARIANT_STYLES[variant]}
                ${SIZE_STYLES[size]}
                ${className}
            `}
            whileHover={!disabled ? {
                scale: 1.02,
                boxShadow: `0 0 25px ${GLOW_COLORS[glowColor]}`,
            } : {}}
            whileTap={!disabled ? {
                scale: 0.95,
            } : {}}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
        >
            {children}
        </motion.button>
    );
}
