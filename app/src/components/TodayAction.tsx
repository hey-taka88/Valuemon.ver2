'use client';

import { LIFE_AREAS } from '@/data/actionData';
import { useActionLogStore, type TodayGoal } from '@/stores/actionLogStore';

interface TodayActionProps {
    goal: TodayGoal;
    onObstacleClick: () => void;
    onComplete: () => void;
}

export default function TodayAction({ goal, onObstacleClick, onComplete }: TodayActionProps) {
    const { startGoal } = useActionLogStore();
    const area = LIFE_AREAS[goal.area];

    const handleStart = () => {
        startGoal();
    };

    const handleComplete = () => {
        onComplete();
    };

    // 完了済み表示（大きく目立つデザイン）
    if (goal.status === 'completed') {
        return (
            <div className="mx-4 p-6 rounded-2xl bg-gradient-to-r from-green-800/50 to-emerald-800/50 border-2 border-green-500/50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        今日の目標達成！
                    </h2>
                    <p className="text-xl text-white mb-2">
                        {goal.goalText}
                    </p>
                    <p className="text-lg text-[var(--flame-glow)]">
                        価値観に沿った行動ができました✨
                    </p>
                </div>
            </div>
        );
    }

    // 通常表示
    return (
        <div className="mx-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--flame-glow)]/30">
            {/* 目標表示 */}
            <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{area.emoji}</span>
                <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">TODAY&apos;S GOAL</p>
                    <p className="text-lg font-semibold text-white mt-1">{goal.goalText}</p>
                    <p className="text-xs text-gray-500 mt-1">{area.name}</p>
                </div>
            </div>

            {/* ステータス表示 */}
            {goal.status === 'started' && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--flame-glow)]/10 border border-[var(--flame-glow)]/30">
                    <span className="animate-pulse">🔥</span>
                    <span className="text-sm text-[var(--flame-glow)]">取り組み中...</span>
                </div>
            )}

            {/* If-Thenプラン表示 */}
            {goal.ifThenPlan && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-500/30">
                    <p className="text-xs text-blue-400 mb-1">💡 If-Thenプラン</p>
                    <p className="text-sm text-gray-300">{goal.ifThenPlan}</p>
                </div>
            )}

            {/* アクションボタン */}
            <div className="flex gap-2">
                {goal.status === 'planned' ? (
                    <button
                        onClick={handleStart}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] text-white font-bold hover:shadow-lg hover:shadow-[var(--flame-glow)]/30 transition-all"
                    >
                        ⚡ 着手する
                    </button>
                ) : (
                    <button
                        onClick={handleComplete}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                        ✅ 完了！
                    </button>
                )}
                <button
                    onClick={onObstacleClick}
                    className="px-4 py-3 rounded-lg border border-gray-600 text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all"
                    title="うまくいかない"
                >
                    😓
                </button>
            </div>
        </div>
    );
}
