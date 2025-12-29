'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const DIAGNOSIS_MODES = [
    {
        id: 'shadow',
        title: 'シャドウ・プロファイリング',
        description: '感情からガチで掘る',
        icon: '🌑',
        duration: '約10分',
        recommended: true,
        available: true,
    },
    {
        id: 'lantern',
        title: 'バリューランタン',
        description: '88枚のカードから価値観を特定',
        icon: '🏮',
        duration: '約10分',
        available: true,
    },
    {
        id: 'sentence',
        title: 'アンフィニッシュド・センテンス',
        description: '文章を書きながら整理したい',
        icon: '✍️',
        duration: '約8分',
        available: true,
    },
    {
        id: 'cci',
        title: 'CCI（キャリア構築インタビュー）',
        description: '人生のテーマを深掘りする6つの質問',
        icon: '🎭',
        duration: '約15分',
        available: true,
    },
    {
        id: 'full',
        title: 'フルコース',
        description: '全部ミックス（おすすめ）',
        icon: '🎯',
        duration: '約30分',
        available: false,
    },
];

export default function DiagnosisPage() {
    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-40">
            {/* ヘッダー */}
            <header className="p-4">
                <Link href="/" className="text-gray-400 text-sm">← 戻る</Link>
                <h1 className="text-2xl font-bold mt-2">診断モード選択</h1>
                <p className="text-sm text-gray-400 mt-1">
                    あなたに合った方法で価値観を探りましょう
                </p>
            </header>

            {/* モード選択 */}
            <section className="px-4 py-6 space-y-4">
                {DIAGNOSIS_MODES.map((mode) => {
                    const CardContent = (
                        <div className={`
              card relative overflow-hidden transition-all
              ${mode.available ? 'hover:border-[var(--flame-glow)] hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'}
              ${mode.recommended ? 'border-[var(--flame-ember)]' : ''}
            `}>
                            {/* バッジ */}
                            {mode.recommended && mode.available && (
                                <div className="absolute top-0 right-0 bg-[var(--flame-core)] text-xs px-3 py-1 rounded-bl-lg">
                                    おすすめ
                                </div>
                            )}
                            {!mode.available && (
                                <div className="absolute top-0 right-0 bg-gray-600 text-xs px-3 py-1 rounded-bl-lg">
                                    Coming Soon
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{mode.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{mode.title}</h3>
                                    <p className="text-gray-400 text-sm">{mode.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">⏱️ {mode.duration}</p>
                                </div>
                                <div className="text-gray-500">{mode.available ? '→' : '🔒'}</div>
                            </div>
                        </div>
                    );

                    if (mode.available) {
                        return (
                            <Link key={mode.id} href={`/diagnosis/${mode.id}`} className="block">
                                {CardContent}
                            </Link>
                        );
                    }

                    return (
                        <div key={mode.id} className="block">
                            {CardContent}
                        </div>
                    );
                })}
            </section>

            {/* 説明 */}
            <section className="px-4 py-6">
                <div className="card bg-[var(--bg-surface)]">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span>💡</span> 診断について
                    </h3>
                    <ul className="text-sm text-gray-400 space-y-2">
                        <li>• <strong>シャドウ・プロファイリング</strong>: 嫉妬・怒り・喪失から本音の価値観を逆算</li>
                        <li>• <strong className="text-gray-500">バリューランタン</strong>: <span className="text-gray-500">価値観カードソート（準備中）</span></li>
                        <li>• <strong className="text-gray-500">アンフィニッシュド</strong>: <span className="text-gray-500">文章穴埋め方式（準備中）</span></li>
                        <li>• <strong className="text-gray-500">フルコース</strong>: <span className="text-gray-500">3つを組み合わせ（準備中）</span></li>
                    </ul>
                </div>
            </section>

            <BottomNav />
        </main>
    );
}
