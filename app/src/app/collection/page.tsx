'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { useCollectionStore, type CollectedMonster } from '@/stores/collectionStore';
import { getVariantById, getMonsterStage, getThemeColors } from '@/data/monsterVariants';

export default function CollectionPage() {
    const { monsters, getStats } = useCollectionStore();
    const [stats, setStats] = useState({ totalMonsters: 0, maxLevelMonsters: 0, totalHabits: 0, bestStreak: 0 });

    useEffect(() => {
        setStats(getStats());
    }, [getStats, monsters]);

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-32">
            {/* ヘッダー */}
            <header className="p-4 text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] bg-clip-text text-transparent">
                    📚 図鑑
                </h1>
                <p className="text-sm text-gray-400 mt-1">育てたモンスターの記録</p>
            </header>

            {/* 統計 */}
            <section className="px-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--bg-surface)] rounded-xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-[var(--flame-glow)]">{stats.totalMonsters}</p>
                        <p className="text-xs text-gray-400 mt-1">育成完了</p>
                    </div>
                    <div className="bg-[var(--bg-surface)] rounded-xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-yellow-400">{stats.maxLevelMonsters}</p>
                        <p className="text-xs text-gray-400 mt-1">最大レベル達成</p>
                    </div>
                    <div className="bg-[var(--bg-surface)] rounded-xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-green-400">{stats.totalHabits}</p>
                        <p className="text-xs text-gray-400 mt-1">累計習慣達成</p>
                    </div>
                    <div className="bg-[var(--bg-surface)] rounded-xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-blue-400">{stats.bestStreak}</p>
                        <p className="text-xs text-gray-400 mt-1">最長ストリーク</p>
                    </div>
                </div>
            </section>

            {/* モンスター一覧 */}
            <section className="px-4">
                <h2 className="text-lg font-semibold mb-4">🐉 育成記録</h2>

                {monsters.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🥚</div>
                        <p className="text-gray-400">まだモンスターがいません</p>
                        <p className="text-sm text-gray-500 mt-2">
                            習慣を完了してモンスターを育てよう
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {monsters.slice().reverse().map((monster) => (
                            <MonsterCard key={monster.id} monster={monster} />
                        ))}
                    </div>
                )}
            </section>

            <BottomNav />
        </main>
    );
}

// モンスターカードコンポーネント
function MonsterCard({ monster }: { monster: CollectedMonster }) {
    const variant = getVariantById(monster.variantId);
    const stage = getMonsterStage(variant, monster.totalHabits);
    const colors = getThemeColors(variant.theme);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div
            className="bg-[var(--bg-surface)] rounded-xl p-4 border border-white/10"
            style={{ borderColor: `${colors.glow}40` }}
        >
            <div className="flex items-center gap-4">
                {/* モンスターアイコン */}
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                        background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                        boxShadow: `0 0 20px ${colors.glow}`,
                    }}
                >
                    <span className="text-3xl">{stage.emoji}</span>
                </div>

                {/* 情報 */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold" style={{ color: colors.glow }}>
                            {stage.name}
                        </h3>
                        <span className="text-xs bg-[var(--bg-abyss)] px-2 py-0.5 rounded-full text-gray-400">
                            Lv.{monster.finalLevel}
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{monster.habitName}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>🔥 {monster.totalHabits}回達成</span>
                        <span>🏆 最長{monster.longestStreak}日</span>
                    </div>
                </div>
            </div>

            {/* 期間 */}
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500 flex justify-between">
                <span>育成期間</span>
                <span>{formatDate(monster.startDate)} 〜 {formatDate(monster.endDate)}</span>
            </div>
        </div>
    );
}
