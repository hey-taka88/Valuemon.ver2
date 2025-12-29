'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanternStore } from '@/stores/lanternStore';
import Lantern from '@/components/Lantern';

const STEPS = [
    { id: 'flame', label: '炎', emoji: '🔥', description: 'コア価値観' },
    { id: 'protection', label: '守り', emoji: '🛡️', description: '習慣・境界線' },
    { id: 'handle', label: '警告', emoji: '⚠️', description: '危険サイン' },
    { id: 'light', label: '光', emoji: '✨', description: '目指す姿' },
];

export default function CreateLanternPage() {
    const router = useRouter();
    const { currentStep, draft, updateFlame, updateProtection, updateHandle, updateLight, saveLantern, setStep } = useLanternStore();

    // フォーム状態
    const [flameData, setFlameData] = useState({
        primaryValue: '',
        secondaryValue: '',
        personalDefinition: '',
        idealDay: '',
    });

    const [protectionData, setProtectionData] = useState({
        habits: ['', '', ''],
        relationships: [''],
        boundaries: [''],
        supporters: [''],
    });

    const [handleData, setHandleData] = useState({
        bodySigns: [''],
        mindSigns: [''],
        behaviorSigns: [''],
        selfMessage: '',
    });

    const [lightData, setLightData] = useState({
        idealState: '',
        impactOnOthers: '',
        impactOnSociety: '',
    });

    // ローカルストレージから診断結果を読み込む
    useEffect(() => {
        // ドラフトデータがある場合はそれを優先
        if (draft.flame && draft.flame.primaryValue) {
            setFlameData({
                primaryValue: draft.flame.primaryValue,
                secondaryValue: draft.flame.secondaryValue || '',
                personalDefinition: draft.flame.personalDefinition || '',
                idealDay: draft.flame.idealDay || '',
            });
            return;
        }

        // 古い診断データの確認
        const savedResponses = localStorage.getItem('shadowResponses');
        if (savedResponses) {
            // 診断結果から推奨価値観を設定（デモ用）
            setFlameData((prev) => ({
                ...prev,
                primaryValue: '達成',
                secondaryValue: '誠実',
            }));
        }
    }, [draft.flame]);

    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

    const handleNext = () => {
        if (currentStep === 'flame') {
            updateFlame(flameData);
            setStep('protection');
        } else if (currentStep === 'protection') {
            updateProtection({
                habits: protectionData.habits.filter(Boolean),
                relationships: protectionData.relationships.filter(Boolean),
                boundaries: protectionData.boundaries.filter(Boolean),
                supporters: protectionData.supporters.filter(Boolean),
            });
            setStep('handle');
        } else if (currentStep === 'handle') {
            updateHandle({
                bodySigns: handleData.bodySigns.filter(Boolean),
                mindSigns: handleData.mindSigns.filter(Boolean),
                behaviorSigns: handleData.behaviorSigns.filter(Boolean),
                selfMessage: handleData.selfMessage,
            });
            setStep('light');
        } else if (currentStep === 'light') {
            updateLight(lightData);
            saveLantern();
            router.push('/lantern');
        }
    };

    const handleBack = () => {
        if (currentStep === 'protection') setStep('flame');
        else if (currentStep === 'handle') setStep('protection');
        else if (currentStep === 'light') setStep('handle');
    };

    const addArrayItem = (
        setter: React.Dispatch<React.SetStateAction<{ [key: string]: string[] | string }>>,
        key: string
    ) => {
        setter((prev: Record<string, string[] | string>) => ({
            ...prev,
            [key]: [...(prev[key] as string[]), ''],
        }));
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 border-b border-white/10">
                <Link href="/lantern" className="text-gray-400 text-sm">← ランタン</Link>
                <h1 className="text-xl font-bold mt-2">バリューランタン作成</h1>

                {/* ステップインジケーター */}
                <div className="flex items-center justify-between mt-4">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                ${index < stepIndex ? 'bg-[var(--accent-success)]' : ''}
                ${index === stepIndex ? 'bg-[var(--flame-glow)] shadow-[0_0_15px_var(--flame-glow)]' : ''}
                ${index > stepIndex ? 'bg-[var(--bg-surface)]' : ''}
              `}>
                                {step.emoji}
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`w-8 h-0.5 mx-1 ${index < stepIndex ? 'bg-[var(--accent-success)]' : 'bg-gray-600'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </header>

            {/* ランタンビジュアル */}
            <section className="py-4">
                <Lantern
                    flameValue={flameData.primaryValue || '?'}
                    size="sm"
                    animated={true}
                />
            </section>

            {/* フォームエリア */}
            <section className="px-4">
                {/* FLAME */}
                {currentStep === 'flame' && (
                    <div className="space-y-4">
                        <div className="card border-l-4 border-[var(--flame-glow)]">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                🔥 FLAME（炎）- コア価値観
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                あなたの人生を照らす核心的な価値観を設定します。
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">第一の価値観 *</label>
                                    <input
                                        type="text"
                                        value={flameData.primaryValue}
                                        onChange={(e) => setFlameData({ ...flameData, primaryValue: e.target.value })}
                                        placeholder="例: 達成、自由、誠実"
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">第二の価値観</label>
                                    <input
                                        type="text"
                                        value={flameData.secondaryValue}
                                        onChange={(e) => setFlameData({ ...flameData, secondaryValue: e.target.value })}
                                        placeholder="例: 成長、貢献"
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">あなたにとっての定義 *</label>
                                    <textarea
                                        value={flameData.personalDefinition}
                                        onChange={(e) => setFlameData({ ...flameData, personalDefinition: e.target.value })}
                                        placeholder="この価値観があなたにとって何を意味するか"
                                        rows={3}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">理想の1日</label>
                                    <textarea
                                        value={flameData.idealDay}
                                        onChange={(e) => setFlameData({ ...flameData, idealDay: e.target.value })}
                                        placeholder="この価値観に沿った理想的な1日を描写してください"
                                        rows={3}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROTECTION */}
                {currentStep === 'protection' && (
                    <div className="space-y-4">
                        <div className="card border-l-4 border-[var(--bf-conscientiousness)]">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                🛡️ PROTECTION（守り）- 習慣と境界線
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                価値観を守るための習慣、関係性、境界線を設定します。
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">守りたい習慣</label>
                                    {protectionData.habits.map((habit, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={habit}
                                            onChange={(e) => {
                                                const newHabits = [...protectionData.habits];
                                                newHabits[i] = e.target.value;
                                                setProtectionData({ ...protectionData, habits: newHabits });
                                            }}
                                            placeholder={`習慣 ${i + 1}`}
                                            className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white mb-2"
                                        />
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">守る境界線（Noと言うこと）</label>
                                    {protectionData.boundaries.map((boundary, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={boundary}
                                            onChange={(e) => {
                                                const newBoundaries = [...protectionData.boundaries];
                                                newBoundaries[i] = e.target.value;
                                                setProtectionData({ ...protectionData, boundaries: newBoundaries });
                                            }}
                                            placeholder="例: 深夜残業はしない"
                                            className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white mb-2"
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setProtectionData({ ...protectionData, boundaries: [...protectionData.boundaries, ''] })}
                                        className="text-sm text-[var(--flame-glow)]"
                                    >
                                        + 追加
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* HANDLE */}
                {currentStep === 'handle' && (
                    <div className="space-y-4">
                        <div className="card border-l-4 border-[var(--accent-warning)]">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                ⚠️ HANDLE（警告サイン）
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                価値観から外れている時の危険サインを設定します。
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">身体のサイン</label>
                                    <input
                                        type="text"
                                        value={handleData.bodySigns[0]}
                                        onChange={(e) => setHandleData({ ...handleData, bodySigns: [e.target.value] })}
                                        placeholder="例: 肩が凝る、眠れない"
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">心のサイン</label>
                                    <input
                                        type="text"
                                        value={handleData.mindSigns[0]}
                                        onChange={(e) => setHandleData({ ...handleData, mindSigns: [e.target.value] })}
                                        placeholder="例: イライラする、無気力になる"
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">行動のサイン</label>
                                    <input
                                        type="text"
                                        value={handleData.behaviorSigns[0]}
                                        onChange={(e) => setHandleData({ ...handleData, behaviorSigns: [e.target.value] })}
                                        placeholder="例: スマホを見すぎる、人と話さない"
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">自分へのメッセージ</label>
                                    <textarea
                                        value={handleData.selfMessage}
                                        onChange={(e) => setHandleData({ ...handleData, selfMessage: e.target.value })}
                                        placeholder="警告サインが出た時に思い出したい言葉"
                                        rows={2}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LIGHT */}
                {currentStep === 'light' && (
                    <div className="space-y-4">
                        <div className="card border-l-4 border-[var(--accent-success)]">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                ✨ LIGHT（光）- 照らすもの
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                価値観に沿って生きることで広がる光を描写します。
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">理想の自分</label>
                                    <textarea
                                        value={lightData.idealState}
                                        onChange={(e) => setLightData({ ...lightData, idealState: e.target.value })}
                                        placeholder="この価値観を体現している時、あなたはどんな状態？"
                                        rows={2}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">周りへの影響</label>
                                    <textarea
                                        value={lightData.impactOnOthers}
                                        onChange={(e) => setLightData({ ...lightData, impactOnOthers: e.target.value })}
                                        placeholder="あなたが価値観に沿って生きると、周りにどんな影響がある？"
                                        rows={2}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">社会への影響</label>
                                    <textarea
                                        value={lightData.impactOnSociety}
                                        onChange={(e) => setLightData({ ...lightData, impactOnSociety: e.target.value })}
                                        placeholder="長い目で見て、どんな社会的意義がある？"
                                        rows={2}
                                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ナビゲーションボタン */}
            <section className="px-4 mt-6 flex gap-3">
                {stepIndex > 0 && (
                    <button
                        onClick={handleBack}
                        className="flex-1 bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-4 font-semibold"
                    >
                        戻る
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={currentStep === 'flame' && !flameData.primaryValue}
                    className="flex-1 btn-primary disabled:opacity-50"
                >
                    {currentStep === 'light' ? 'ランタンを完成させる' : '次へ'}
                </button>
            </section>
        </main>
    );
}
