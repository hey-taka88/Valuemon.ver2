'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VALUE_CARDS, shuffleCards, ValueCard as ValueCardType } from '@/data/valuesData';
import ValueCard from '@/components/ValueCard';

type Step = 'swipe' | 'select15' | 'select5' | 'rank' | 'complete';

export default function LanternDiagnosisPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('swipe');
    const [cards, setCards] = useState<ValueCardType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 各ステップの選択結果
    const [importantCards, setImportantCards] = useState<ValueCardType[]>([]);
    const [selected15, setSelected15] = useState<ValueCardType[]>([]);
    const [selected5, setSelected5] = useState<ValueCardType[]>([]);
    const [rankedCards, setRankedCards] = useState<ValueCardType[]>([]);

    // 初期化
    useEffect(() => {
        setCards(shuffleCards(VALUE_CARDS));
    }, []);

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    // スワイプステップ: 重要/どちらでもない/重要でない
    const handleSwipe = (choice: 'important' | 'neutral' | 'not-important') => {
        if (choice === 'important') {
            setImportantCards([...importantCards, currentCard]);
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // 全カード完了 → 15枚選択へ
            if (importantCards.length <= 15) {
                // 15枚以下の場合はそのまま次へ
                setSelected15(importantCards);
                setStep('select5');
            } else {
                setStep('select15');
            }
        }
    };

    // 15枚選択
    const toggleSelect15 = (card: ValueCardType) => {
        if (selected15.find(c => c.id === card.id)) {
            setSelected15(selected15.filter(c => c.id !== card.id));
        } else if (selected15.length < 15) {
            setSelected15([...selected15, card]);
        }
    };

    // 5枚選択
    const toggleSelect5 = (card: ValueCardType) => {
        if (selected5.find(c => c.id === card.id)) {
            setSelected5(selected5.filter(c => c.id !== card.id));
        } else if (selected5.length < 5) {
            setSelected5([...selected5, card]);
        }
    };

    // ランク変更
    const moveRank = (index: number, direction: 'up' | 'down') => {
        const newRanked = [...rankedCards];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newRanked.length) {
            [newRanked[index], newRanked[newIndex]] = [newRanked[newIndex], newRanked[index]];
            setRankedCards(newRanked);
        }
    };

    // 完了
    const handleComplete = () => {
        // 結果をローカルストレージに保存
        localStorage.setItem('lanternDiagnosisResult', JSON.stringify({
            rankedValues: rankedCards,
            timestamp: new Date().toISOString(),
        }));
        router.push('/diagnosis/lantern/result');
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 border-b border-white/10">
                <Link href="/diagnosis" className="text-gray-400 text-sm">← モード選択</Link>
                <h1 className="text-xl font-bold mt-2">バリューランタン診断</h1>

                {/* ステップインジケーター */}
                <div className="flex items-center gap-2 mt-3 text-sm">
                    <div className={`px-3 py-1 rounded-full ${step === 'swipe' ? 'bg-[var(--flame-glow)] text-white' : 'bg-gray-700 text-gray-400'}`}>
                        1. 振り分け
                    </div>
                    <div className={`px-3 py-1 rounded-full ${step === 'select15' ? 'bg-[var(--flame-glow)] text-white' : 'bg-gray-700 text-gray-400'}`}>
                        2. 15枚
                    </div>
                    <div className={`px-3 py-1 rounded-full ${step === 'select5' ? 'bg-[var(--flame-glow)] text-white' : 'bg-gray-700 text-gray-400'}`}>
                        3. 5枚
                    </div>
                    <div className={`px-3 py-1 rounded-full ${step === 'rank' ? 'bg-[var(--flame-glow)] text-white' : 'bg-gray-700 text-gray-400'}`}>
                        4. 順位
                    </div>
                </div>
            </header>

            {/* STEP 1: スワイプ */}
            {step === 'swipe' && currentCard && (
                <section className="px-4 py-6">
                    {/* プログレスバー */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>{currentIndex + 1} / {cards.length}</span>
                            <span>重要: {importantCards.length}枚</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--flame-glow)] transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* カード表示 */}
                    <div className="flex justify-center mb-6">
                        <div className="w-full max-w-sm">
                            <ValueCard card={currentCard} size="lg" />
                        </div>
                    </div>

                    {/* 選択ボタン */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => handleSwipe('not-important')}
                            className="px-6 py-4 bg-gray-700 rounded-xl text-gray-400 hover:bg-gray-600"
                        >
                            ❌ 重要でない
                        </button>
                        <button
                            onClick={() => handleSwipe('neutral')}
                            className="px-6 py-4 bg-gray-700 rounded-xl text-gray-400 hover:bg-gray-600"
                        >
                            ➖ どちらでも
                        </button>
                        <button
                            onClick={() => handleSwipe('important')}
                            className="px-6 py-4 bg-[var(--flame-glow)] rounded-xl text-white hover:opacity-90"
                        >
                            ⭐ 重要
                        </button>
                    </div>
                </section>
            )}

            {/* STEP 2: 15枚選択 */}
            {step === 'select15' && (
                <section className="px-4 py-6">
                    <p className="text-center text-gray-400 mb-4">
                        「重要」に選んだ{importantCards.length}枚から、<br />
                        特に大切な<span className="text-[var(--flame-glow)]">15枚</span>を選んでください
                    </p>
                    <p className="text-center text-sm text-gray-500 mb-6">
                        選択中: <span className="text-white">{selected15.length} / 15</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                        {importantCards.map((card) => (
                            <ValueCard
                                key={card.id}
                                card={card}
                                size="sm"
                                showDescription={false}
                                isSelected={selected15.some(c => c.id === card.id)}
                                onSelect={() => toggleSelect15(card)}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (selected15.length <= 5) {
                                setSelected5(selected15);
                                setRankedCards(selected15);
                                setStep('rank');
                            } else {
                                setStep('select5');
                            }
                        }}
                        disabled={selected15.length < 5}
                        className="btn-primary w-full mt-6 disabled:opacity-50"
                    >
                        次へ ({selected15.length}/15)
                    </button>
                </section>
            )}

            {/* STEP 3: 5枚選択 */}
            {step === 'select5' && (
                <section className="px-4 py-6">
                    <p className="text-center text-gray-400 mb-4">
                        さらに絞り込んで、<br />
                        本当に大切な<span className="text-[var(--flame-glow)]">5枚</span>だけ選んでください
                    </p>
                    <p className="text-center text-sm text-gray-500 mb-6">
                        選択中: <span className="text-white">{selected5.length} / 5</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                        {(selected15.length > 0 ? selected15 : importantCards).map((card) => (
                            <ValueCard
                                key={card.id}
                                card={card}
                                size="sm"
                                showDescription={false}
                                isSelected={selected5.some(c => c.id === card.id)}
                                onSelect={() => toggleSelect5(card)}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setRankedCards(selected5);
                            setStep('rank');
                        }}
                        disabled={selected5.length !== 5}
                        className="btn-primary w-full mt-6 disabled:opacity-50"
                    >
                        次へ（5枚選択してください）
                    </button>
                </section>
            )}

            {/* STEP 4: 順位付け */}
            {step === 'rank' && (
                <section className="px-4 py-6">
                    <p className="text-center text-gray-400 mb-6">
                        最も重要な順に並べ替えてください<br />
                        <span className="text-[var(--flame-glow)]">1位</span>があなたのコア価値観です
                    </p>

                    <div className="space-y-3">
                        {rankedCards.map((card, index) => (
                            <div key={card.id} className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => moveRank(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-500 hover:text-white disabled:opacity-30"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => moveRank(index, 'down')}
                                        disabled={index === rankedCards.length - 1}
                                        className="text-gray-500 hover:text-white disabled:opacity-30"
                                    >
                                        ▼
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <ValueCard
                                        card={card}
                                        size="sm"
                                        showDescription={false}
                                        isRanked={true}
                                        rank={index + 1}
                                        isSelected={index === 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleComplete}
                        className="btn-primary w-full mt-6"
                    >
                        結果を見る →
                    </button>
                </section>
            )}
        </main>
    );
}
