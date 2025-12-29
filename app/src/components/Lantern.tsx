'use client';

interface LanternProps {
    flameValue?: string;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export default function Lantern({
    flameValue = '',
    size = 'md',
    animated = true
}: LanternProps) {
    const hasValue = flameValue && flameValue !== '?';

    return (
        <div className="relative flex flex-col items-center">
            {/* 炎本体 */}
            <div
                className={`
                    relative w-24 h-24 rounded-full
                    ${animated ? 'animate-pulse' : ''}
                `}
                style={{
                    background: hasValue
                        ? 'radial-gradient(circle, rgba(255,150,50,0.5) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(150,150,150,0.3) 0%, transparent 70%)',
                    boxShadow: hasValue
                        ? '0 0 40px rgba(255,150,50,0.5)'
                        : '0 0 20px rgba(150,150,150,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <span
                    className={`${animated ? 'animate-[flameFlicker_0.5s_ease-in-out_infinite_alternate]' : ''}`}
                    style={{
                        fontSize: '3rem',
                        lineHeight: 1,
                        display: 'block',
                        textAlign: 'center',
                    }}
                >
                    {hasValue ? '🔥' : '❓'}
                </span>
            </div>

            {/* 価値観名 */}
            <p className="mt-3 text-lg font-bold text-[var(--flame-glow)] text-center">
                {hasValue ? `${flameValue}の炎` : '価値観未設定'}
            </p>
        </div>
    );
}
