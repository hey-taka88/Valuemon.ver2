'use client';

import React from 'react';
import Image from 'next/image';

interface CardFrameProps {
    children: React.ReactNode;
    variant?: 'gold' | 'silver';
    className?: string;
}

export default function CardFrame({
    children,
    variant = 'gold',
    className = '',
}: CardFrameProps) {
    const frameImage = variant === 'gold'
        ? '/images/ui/ui_card_frame_gold.png'
        : '/images/ui/ui_card_frame_silver.png';

    const [hasImage, setHasImage] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.onload = () => setHasImage(true);
            img.onerror = () => setHasImage(false);
            img.src = frameImage;
        }
    }, [frameImage]);

    // フォールバックスタイル
    const fallbackStyles = {
        gold: 'border-2 border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-amber-800/10',
        silver: 'border-2 border-slate-400/50 bg-gradient-to-br from-slate-800/20 to-slate-700/10',
    };

    return (
        <div
            className={`
                relative p-6 min-h-[200px]
                ${!hasImage ? `rounded-xl ${fallbackStyles[variant]}` : ''}
                ${className}
            `}
        >
            {/* フレーム画像 */}
            {hasImage && (
                <Image
                    src={frameImage}
                    alt="card frame"
                    fill
                    className="object-contain pointer-events-none"
                />
            )}

            {/* コンテンツ */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
