'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lantern from '@/components/Lantern';
import { useLanternStore } from '@/stores/lanternStore';
import { SENTENCE_CATEGORIES, getCategoryById } from '@/data/sentenceData';

interface CategoryAnalysis {
    categoryId: string;
    categoryName: string;
    emoji: string;
    values: {
        id: string;
        name: string;
        confidence: number;
        evidence: string;
    }[];
}

interface AnalysisResult {
    categories: CategoryAnalysis[];
    primaryValue: {
        id: string;
        name: string;
        confidence: number;
    };
    summary: string;
}

export default function SentenceResultPage() {
    const router = useRouter();
    const { updateFlame } = useLanternStore();

    const [isLoading, setIsLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const analyzeResponses = async () => {
            try {
                const stored = localStorage.getItem('sentenceResponses');
                if (!stored) {
                    setError('回答データが見つかりません。診断をやり直してください。');
                    setIsLoading(false);
                    return;
                }

                const responses = JSON.parse(stored);

                // カテゴリごとに回答をグループ化
                const groupedResponses: Record<string, string[]> = {};
                responses.forEach((r: { categoryId: string; answer: string }) => {
                    if (!groupedResponses[r.categoryId]) {
                        groupedResponses[r.categoryId] = [];
                    }
                    groupedResponses[r.categoryId].push(r.answer);
                });

                // 分析APIを呼び出し
                const res = await fetch('/api/analyze-sentence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ responses: groupedResponses }),
                });

                if (!res.ok) {
                    throw new Error('分析に失敗しました');
                }

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setAnalysisResult(data);
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
        const primaryValue = analysisResult?.primaryValue;
        if (primaryValue) {
            // 診断結果をランタン作成画面に引き継ぐ
            updateFlame({
                primaryValue: primaryValue.name,
                secondaryValue: '',
                personalDefinition: '',
                idealDay: '',
            });
        }
        router.push('/lantern/create');
    };

    const handleRetry = () => {
        router.push('/diagnosis/sentence');
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
                        文章を解析中...
                    </p>
                    <p className="text-gray-400 text-sm">
                        あなたの言葉からコア価値観を抽出しています
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

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 text-center">
                <h1 className="text-2xl font-bold">診断結果</h1>
                <p className="text-sm text-gray-400 mt-1">言葉から浮かび上がった価値観</p>
            </header>

            {/* ランタンビジュアル */}
            <section className="py-6">
                <Lantern
                    flameValue={analysisResult.primaryValue?.name || '発見'}
                    size="lg"
                    animated={true}
                />
            </section>

            {/* 総合判定 */}
            <section className="px-4 mb-6">
                <div className="card card-glow text-center">
                    <h2 className="text-lg font-bold mb-4 text-[var(--flame-glow)]">
                        ✍️ 文章から見えた本音
                    </h2>
                    <p className="text-gray-300 mb-4">
                        {analysisResult.summary}
                    </p>
                    <div className="flex justify-center gap-3">
                        {SENTENCE_CATEGORIES.map(cat => (
                            <span key={cat.id} className="text-2xl">{cat.emoji}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* カテゴリ別分析 */}
            <section className="px-4 mb-6 space-y-4">
                {analysisResult.categories?.map((cat) => {
                    const categoryInfo = getCategoryById(cat.categoryId);
                    return (
                        <div key={cat.categoryId} className="card">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{cat.emoji}</span>
                                <h3 className="font-bold text-lg">{cat.categoryName}</h3>
                            </div>

                            {cat.values.map((value, idx) => (
                                <div key={idx} className="mb-3 last:mb-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[var(--flame-glow)] font-medium">
                                            {value.name}
                                        </span>
                                        <span className="text-sm text-[var(--accent-success)]">
                                            {value.confidence}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">{value.evidence}</p>
                                    <div className="stat-bar mt-2">
                                        <div
                                            className="stat-bar-fill"
                                            style={{
                                                width: `${value.confidence}%`,
                                                backgroundColor: categoryInfo?.color || 'var(--flame-glow)',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </section>

            {/* アクションボタン */}
            <section className="px-4 space-y-3">
                <button
                    onClick={handleCreateLantern}
                    className="btn-primary w-full"
                >
                    🏮 ランタンを構築する
                </button>

                <Link href="/" className="block">
                    <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-4 font-semibold">
                        ホームに戻る
                    </button>
                </Link>
            </section>
        </main>
    );
}
