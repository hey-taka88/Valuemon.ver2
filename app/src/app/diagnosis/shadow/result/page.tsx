'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lantern from '@/components/Lantern';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useLanternStore } from '@/stores/lanternStore';
import { VALUE_CARDS } from '@/data/valuesData';

interface AnalyzedValue {
    id: string;
    name: string;
    source: 'envy' | 'rage' | 'loss';
    confidence: number;
    evidence: string;
}

interface AnalysisResult {
    values: AnalyzedValue[];
    analysis: {
        hiddenDesire: string;
        coreRule: string;
        identity: string;
    };
    summary: string;
}

const SOURCE_INFO = {
    envy: { label: '嫉妬から', emoji: '💚' },
    rage: { label: '怒りから', emoji: '🔥' },
    loss: { label: '喪失から', emoji: '💔' },
};

export default function ShadowResultPage() {
    const router = useRouter();
    const { reset } = useDiagnosisStore();
    const { updateFlame } = useLanternStore();

    const [isLoading, setIsLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const analyzeResponses = async () => {
            try {
                // ローカルストレージから回答を取得
                const stored = localStorage.getItem('shadowResponses');
                if (!stored) {
                    setError('回答データが見つかりません。診断をやり直してください。');
                    setIsLoading(false);
                    return;
                }

                const responses = JSON.parse(stored);

                // 分析APIを呼び出し
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        envyResponses: responses.envy || [],
                        rageResponses: responses.rage || [],
                        lossResponses: responses.loss || [],
                    }),
                });

                if (!res.ok) {
                    throw new Error('分析に失敗しました');
                }

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                // 価値観のカテゴリ色を追加
                const enrichedValues = data.values?.map((v: AnalyzedValue) => {
                    const card = VALUE_CARDS.find(c => c.id === v.id);
                    return {
                        ...v,
                        categoryColor: card?.categoryColor || '#888',
                        description: card?.description || v.evidence,
                    };
                }) || [];

                setAnalysisResult({
                    ...data,
                    values: enrichedValues,
                });
            } catch (err) {
                console.error('Analysis error:', err);
                setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
            } finally {
                setIsLoading(false);
            }
        };

        analyzeResponses();
    }, []);

    const handleCreateLantern = () => {
        const primaryValue = analysisResult?.values?.[0];
        if (primaryValue) {
            updateFlame({
                primaryValue: primaryValue.name,
                secondaryValue: '',
                personalDefinition: '',
                idealDay: '',
            });
        }
        reset();
        router.push('/lantern/create');
    };

    const handleRetry = () => {
        reset();
        router.push('/diagnosis/shadow');
    };

    // ローディング中
    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--bg-abyss)] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-[var(--flame-glow)] border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-2 border-4 border-[var(--flame-ember)] border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="text-[var(--flame-glow)] text-lg font-semibold mb-2">
                        シャドウを解析中...
                    </p>
                    <p className="text-gray-400 text-sm">
                        あなたの闇から価値観を召喚しています
                    </p>
                </div>
            </main>
        );
    }

    // エラー時
    if (error || !analysisResult) {
        return (
            <main className="min-h-screen bg-[var(--bg-abyss)] p-4">
                <div className="max-w-md mx-auto mt-20 text-center">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h1 className="text-xl font-bold mb-4">分析できませんでした</h1>
                    <p className="text-gray-400 mb-8">
                        {error || '予期しないエラーが発生しました'}
                    </p>
                    <div className="space-y-3">
                        <button onClick={handleRetry} className="btn-primary w-full">
                            診断をやり直す
                        </button>
                        <Link href="/diagnosis" className="block">
                            <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-4">
                                モード選択に戻る
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const primaryValue = analysisResult.values[0];

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 text-center">
                <h1 className="text-2xl font-bold">診断結果</h1>
                <p className="text-sm text-gray-400 mt-1">シャドウから召喚された価値観</p>
            </header>

            {/* ランタンビジュアル */}
            <section className="py-6">
                <Lantern
                    flameValue={primaryValue?.name || '発見'}
                    size="lg"
                    animated={true}
                />
            </section>

            {/* 判決 */}
            <section className="px-4 mb-6">
                <div className="card card-glow text-center">
                    <h2 className="text-lg font-bold mb-4 text-[var(--flame-glow)]">
                        ⚖️ 判決
                    </h2>
                    <p className="text-gray-300 mb-4">
                        {analysisResult.summary || '君のシャドウから、以下のコア価値観が検出された。'}
                    </p>
                    <div className="flex justify-center gap-4 text-2xl">
                        <span>💚</span>
                        <span>🔥</span>
                        <span>💔</span>
                    </div>
                </div>
            </section>

            {/* 検出された価値観リスト */}
            <section className="px-4 mb-6 space-y-4">
                {analysisResult.values.map((value, index) => (
                    <div key={value.id || index} className="card">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <span className="text-xs text-gray-400">
                                    {SOURCE_INFO[value.source]?.emoji} {SOURCE_INFO[value.source]?.label}
                                </span>
                                <h3 className="text-xl font-bold text-[var(--flame-glow)]">
                                    {value.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400">確信度</span>
                                <p className="text-lg font-bold text-[var(--accent-success)]">
                                    {value.confidence}%
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{value.evidence}</p>

                        {/* 確信度バー */}
                        <div className="stat-bar mt-3">
                            <div
                                className="stat-bar-fill"
                                style={{
                                    width: `${value.confidence}%`,
                                    background: 'var(--accent-success)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* 分析サマリー */}
            <section className="px-4 mb-8">
                <div className="card bg-[var(--bg-surface)]">
                    <h3 className="font-semibold mb-3">📊 分析サマリー</h3>
                    <ul className="text-sm text-gray-400 space-y-2">
                        {analysisResult.analysis?.hiddenDesire && (
                            <li>
                                <strong className="text-white">隠された野心:</strong>{' '}
                                {analysisResult.analysis.hiddenDesire}
                            </li>
                        )}
                        {analysisResult.analysis?.coreRule && (
                            <li>
                                <strong className="text-white">譲れない正義:</strong>{' '}
                                {analysisResult.analysis.coreRule}
                            </li>
                        )}
                        {analysisResult.analysis?.identity && (
                            <li>
                                <strong className="text-white">自我の土台:</strong>{' '}
                                {analysisResult.analysis.identity}
                            </li>
                        )}
                    </ul>
                </div>
            </section>

            {/* アクションボタン */}
            <section className="px-4 space-y-3 pb-24">
                <button
                    onClick={handleCreateLantern}
                    className="btn-primary w-full"
                >
                    🏮 ランタンを構築する
                </button>

                <Link href="/" className="block">
                    <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-gray-400 rounded-xl py-4">
                        ホームに戻る
                    </button>
                </Link>
            </section>
        </main>
    );
}
