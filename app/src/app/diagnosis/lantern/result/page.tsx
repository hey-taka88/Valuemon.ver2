'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ValueCard as ValueCardType } from '@/data/valuesData';
import ValueCard from '@/components/ValueCard';
import Lantern from '@/components/Lantern';

interface DiagnosisResult {
    rankedValues: ValueCardType[];
    timestamp: string;
}

export default function LanternDiagnosisResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lanternDiagnosisResult');
        if (saved) {
            setResult(JSON.parse(saved));
        }
    }, []);

    if (!result) {
        return (
            <main className="min-h-screen bg-[var(--bg-abyss)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">診断結果がありません</p>
                    <Link href="/diagnosis/lantern" className="btn-primary">
                        診断を始める
                    </Link>
                </div>
            </main>
        );
    }

    const primaryValue = result.rankedValues[0];
    const secondaryValue = result.rankedValues[1];

    const handleCreateLantern = () => {
        // ランタン作成ページに価値観を引き継ぐ
        localStorage.setItem('lanternFlameData', JSON.stringify({
            primaryValue: primaryValue.name,
            secondaryValue: secondaryValue?.name || '',
            values: result.rankedValues,
        }));
        router.push('/lantern/create');
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 border-b border-white/10">
                <Link href="/diagnosis" className="text-gray-400 text-sm">← モード選択</Link>
                <h1 className="text-xl font-bold mt-2">診断結果</h1>
            </header>

            {/* メインビジュアル */}
            <section className="py-8 text-center">
                <Lantern flameValue={primaryValue.name} size="md" animated={true} />

                <h2 className="text-2xl font-bold mt-4">
                    あなたのコア価値観
                </h2>
                <p className="text-[var(--flame-glow)] text-3xl font-bold mt-2">
                    {primaryValue.name}
                </p>
                {secondaryValue && (
                    <p className="text-gray-400 mt-1">
                        × {secondaryValue.name}
                    </p>
                )}
            </section>

            {/* トップ5 */}
            <section className="px-4">
                <h3 className="font-bold mb-4">あなたの価値観トップ5</h3>
                <div className="space-y-3">
                    {result.rankedValues.map((card, index) => (
                        <ValueCard
                            key={card.id}
                            card={card}
                            size="sm"
                            isRanked={true}
                            rank={index + 1}
                            isSelected={index === 0}
                        />
                    ))}
                </div>
            </section>

            {/* 分析 */}
            <section className="px-4 mt-6">
                <div className="card">
                    <h3 className="font-bold mb-3">💡 価値観の傾向</h3>
                    <p className="text-sm text-gray-400">
                        あなたは「<span className="text-white">{primaryValue.name}</span>」を最も大切にしています。
                        {primaryValue.description}という欲求が強く、人生の指針となっています。
                    </p>
                    {secondaryValue && (
                        <p className="text-sm text-gray-400 mt-2">
                            また「<span className="text-white">{secondaryValue.name}</span>」も重視しており、
                            この2つの価値観のバランスがあなたの生き方を形作っています。
                        </p>
                    )}
                </div>
            </section>

            {/* アクション */}
            <section className="px-4 mt-6 space-y-3">
                <button
                    onClick={handleCreateLantern}
                    className="btn-primary w-full"
                >
                    🏮 この価値観でランタンを作成
                </button>

                <Link href="/diagnosis/lantern" className="block">
                    <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-3">
                        🔄 もう一度診断する
                    </button>
                </Link>
            </section>
        </main>
    );
}
