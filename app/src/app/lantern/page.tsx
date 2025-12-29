'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import Lantern from '@/components/Lantern';
import { useLanternStore } from '@/stores/lanternStore';

export default function LanternPage() {
    const { lantern } = useLanternStore();

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-40">
            {/* ヘッダー */}
            <header className="p-4">
                <h1 className="text-2xl font-bold">バリューランタン</h1>
                <p className="text-sm text-gray-400 mt-1">
                    あなたの価値観を照らす灯火
                </p>
            </header>

            {lantern ? (
                <>
                    {/* ランタン表示 */}
                    <section className="py-8 flex justify-center">
                        <Lantern
                            flameValue={lantern.flame.primaryValue}
                            size="lg"
                            animated={true}
                        />
                        {lantern.flame.secondaryValue && (
                            <p className="text-center text-[var(--flame-glow)] mt-2">
                                {lantern.flame.primaryValue} × {lantern.flame.secondaryValue}
                            </p>
                        )}
                    </section>

                    {/* ランタン構造 */}
                    <section className="px-4 space-y-4">
                        {/* Flame */}
                        <div className="card border-l-4 border-[var(--flame-glow)]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🔥</span>
                                <h3 className="font-bold">FLAME（炎）</h3>
                            </div>
                            <p className="text-lg text-[var(--flame-glow)]">
                                {lantern.flame.primaryValue}
                                {lantern.flame.secondaryValue && ` × ${lantern.flame.secondaryValue}`}
                            </p>
                            {lantern.flame.personalDefinition && (
                                <p className="text-sm text-gray-400 mt-2">
                                    {lantern.flame.personalDefinition}
                                </p>
                            )}
                        </div>

                        {/* Protection */}
                        {(lantern.protection.habits.length > 0 || lantern.protection.boundaries.length > 0) && (
                            <div className="card border-l-4 border-[var(--bf-conscientiousness)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🛡️</span>
                                    <h3 className="font-bold">PROTECTION（守り）</h3>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {lantern.protection.habits.map((habit, i) => (
                                        <li key={`habit-${i}`}>• {habit}</li>
                                    ))}
                                    {lantern.protection.boundaries.map((boundary, i) => (
                                        <li key={`boundary-${i}`} className="text-[var(--accent-warning)]">
                                            🚫 {boundary}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Handle */}
                        {(lantern.handle.bodySigns.length > 0 || lantern.handle.mindSigns.length > 0) && (
                            <div className="card border-l-4 border-[var(--accent-warning)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">⚠️</span>
                                    <h3 className="font-bold">HANDLE（警告サイン）</h3>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {lantern.handle.bodySigns.map((sign, i) => (
                                        <li key={`body-${i}`}>🫀 {sign}</li>
                                    ))}
                                    {lantern.handle.mindSigns.map((sign, i) => (
                                        <li key={`mind-${i}`}>🧠 {sign}</li>
                                    ))}
                                    {lantern.handle.behaviorSigns.map((sign, i) => (
                                        <li key={`behavior-${i}`}>🎭 {sign}</li>
                                    ))}
                                </ul>
                                {lantern.handle.selfMessage && (
                                    <div className="mt-3 p-3 bg-[var(--bg-surface)] rounded-lg">
                                        <p className="text-sm italic text-[var(--flame-glow)]">
                                            「{lantern.handle.selfMessage}」
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Light */}
                        {lantern.light.idealState && (
                            <div className="card border-l-4 border-[var(--accent-success)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">✨</span>
                                    <h3 className="font-bold">LIGHT（照らすもの）</h3>
                                </div>
                                <p className="text-sm text-gray-300">
                                    {lantern.light.idealState}
                                </p>
                                {lantern.light.impactOnOthers && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        👥 {lantern.light.impactOnOthers}
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    {/* 編集ボタン */}
                    <section className="px-4 mt-6">
                        <Link href="/lantern/create">
                            <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-3">
                                ✏️ ランタンを編集
                            </button>
                        </Link>
                    </section>
                </>
            ) : (
                /* ランタン未作成時 */
                <section className="px-4 py-12 text-center">
                    <div className="opacity-50 mb-8">
                        <Lantern flameValue="?" size="lg" animated={false} />
                    </div>

                    <h2 className="text-xl font-bold mb-3">ランタンがまだありません</h2>
                    <p className="text-gray-400 mb-6">
                        診断結果を基に、あなたの価値観を灯火にしましょう
                    </p>

                    <Link href="/lantern/create">
                        <button className="btn-primary">
                            🏮 ランタンを作成する
                        </button>
                    </Link>

                    <p className="text-gray-500 text-sm mt-4">
                        または先に
                        <Link href="/diagnosis" className="text-[var(--flame-glow)] ml-1">
                            診断を受ける
                        </Link>
                    </p>
                </section>
            )}

            <BottomNav />
        </main>
    );
}
