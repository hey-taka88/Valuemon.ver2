'use client';

import React from 'react';
import Image from 'next/image';

interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

// バリアントに応じた画像パス
const BUTTON_IMAGES = {
    primary: '/images/ui/ui_button_primary.png',
    secondary: '/images/ui/ui_button_secondary.png',
};

// サイズ設定
const SIZE_CLASSES = {
    sm: 'w-32 h-10',
    md: 'w-48 h-14',
    lg: 'w-64 h-16',
};

export default function ImageButton({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled,
    ...props
}: ImageButtonProps) {
    const bgImage = BUTTON_IMAGES[variant];
    const sizeClass = SIZE_CLASSES[size];

    // 画像があるかチェック用の state
    const [hasImage, setHasImage] = React.useState(false);

    React.useEffect(() => {
        // クライアントサイドで画像の存在確認
        if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.onload = () => setHasImage(true);
            img.onerror = () => setHasImage(false);
            img.src = bgImage;
        }
    }, [bgImage]);

    // 画像がない場合のフォールバックスタイル
    const fallbackStyles = {
        primary: 'bg-gradient-to-r from-amber-600 to-amber-800 border-2 border-amber-400',
        secondary: 'bg-gradient-to-r from-slate-600 to-slate-800 border-2 border-slate-400',
    };

    const textStyles = {
        primary: 'text-amber-100',
        secondary: 'text-slate-300',
    };

    return (
        <button
            className={`
                relative group ${sizeClass} flex items-center justify-center 
                transition-all duration-200 
                active:scale-95 hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${!hasImage ? `rounded-lg ${fallbackStyles[variant]}` : ''}
                ${className}
            `}
            disabled={disabled}
            {...props}
        >
            {/* 背景画像 */}
            {hasImage && (
                <Image
                    src={bgImage}
                    alt="button background"
                    fill
                    className="object-contain drop-shadow-lg"
                    draggable={false}
                />
            )}

            {/* ボタンのテキスト */}
            <span
                className={`
                    relative z-10 text-lg font-bold tracking-widest font-serif drop-shadow-md
                    ${textStyles[variant]}
                `}
            >
                {children}
            </span>

            {/* ホバー時の光るエフェクト */}
            <div
                className={`
                    absolute inset-0 bg-white/10 opacity-0 
                    group-hover:opacity-100 transition-opacity 
                    ${hasImage ? '' : 'rounded-lg'}
                    mix-blend-overlay
                `}
            />
        </button>
    );
}
