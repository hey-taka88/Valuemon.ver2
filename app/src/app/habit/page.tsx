'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import HabitCard, { HabitSetupForm, RewardTestModal } from '@/components/HabitCard';
import HabitMonster from '@/components/HabitMonster';
import { useHabitStore } from '@/stores/habitStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { getVariantById, getMonsterStage } from '@/data/monsterVariants';

export default function HabitPage() {
    const {
        currentHabit,
        monsterVariantId,
        totalCompletions,
        longestStreak,
        resetHabit,
        needsRewardTest,
        rewardTestHistory,
        habitFormed,
    } = useHabitStore();

    const { addMonster } = useCollectionStore();

    const [showSetup, setShowSetup] = useState(false);
    const [showRewardTest, setShowRewardTest] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [habitStartDate] = useState(() => new Date().toISOString());

    // 報酬テストが必要かチェック
    useEffect(() => {
        if (needsRewardTest()) {
            setShowRewardTest(true);
        }
    }, [needsRewardTest]);

    const handleSetupComplete = () => {
        setShowSetup(false);
    };

    const handleReset = () => {
        // コレクションに保存（習慣があり、達成回数が1以上の場合）
        if (currentHabit && monsterVariantId && totalCompletions > 0) {
            const variant = getVariantById(monsterVariantId);
            const stage = getMonsterStage(variant, totalCompletions);

            addMonster({
                variantId: monsterVariantId,
                habitName: currentHabit,
                finalLevel: stage.level,
                totalHabits: totalCompletions,
                startDate: habitStartDate,
                longestStreak: longestStreak,
            });
        }

        resetHabit();
        setShowResetConfirm(false);
    };

    return (
        <div className="habit-page">
            <header className="habit-page__header">
                <h1 className="habit-page__title">
                    🔥 習慣の炎
                </h1>
                <p className="habit-page__subtitle">
                    1つの習慣に集中して、確実に身につける
                </p>
            </header>

            <main className="habit-page__main">
                {!currentHabit || showSetup ? (
                    <HabitSetupForm onComplete={handleSetupComplete} />
                ) : (
                    <>
                        {/* 習慣モンスター表示 */}
                        <div className="flex justify-center py-4">
                            <HabitMonster />
                        </div>

                        <HabitCard />

                        {/* 習慣化達成バッジ */}
                        {habitFormed && (
                            <motion.div
                                className="habit-page__formed"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="habit-page__formed-icon">🏆</div>
                                <h3>習慣化達成！</h3>
                                <p>報酬がなくても続けられるようになりました。</p>
                                <p>新しい習慣にチャレンジしてみませんか？</p>
                            </motion.div>
                        )}

                        {/* 報酬テスト履歴 */}
                        {rewardTestHistory.length > 0 && (
                            <div className="habit-page__history">
                                <h3 className="habit-page__history-title">
                                    📊 習慣化テスト履歴
                                </h3>
                                <div className="habit-page__history-list">
                                    {rewardTestHistory.slice(-5).reverse().map((test, i) => (
                                        <div
                                            key={i}
                                            className={`habit-page__history-item ${test.passed ? 'passed' : 'failed'}`}
                                        >
                                            <span className="habit-page__history-date">
                                                {new Date(test.date).toLocaleDateString('ja-JP', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="habit-page__history-result">
                                                {test.passed ? '✓ 成功' : '△ 継続中'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* アクションボタン */}
                        <div className="habit-page__actions">
                            <button
                                className="habit-page__action-btn"
                                onClick={() => setShowSetup(true)}
                            >
                                習慣を変更する
                            </button>
                            <button
                                className="habit-page__action-btn habit-page__action-btn--danger"
                                onClick={() => setShowResetConfirm(true)}
                            >
                                リセット
                            </button>
                        </div>
                    </>
                )}

                {/* 習慣化のコツ */}
                <div className="habit-page__tips">
                    <h3 className="habit-page__tips-title">💡 習慣化のコツ</h3>
                    <ul className="habit-page__tips-list">
                        <li>1つの習慣に集中する</li>
                        <li>やったらすぐ報酬を取る</li>
                        <li>報酬なしでも続くか週1でテスト</li>
                        <li>自然の中でやると効果UP</li>
                    </ul>
                </div>
            </main>

            {/* 報酬テストモーダル */}
            <RewardTestModal
                isOpen={showRewardTest}
                onClose={() => setShowRewardTest(false)}
            />

            {/* リセット確認モーダル */}
            <AnimatePresence>
                {showResetConfirm && (
                    <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2 className="modal-title">⚠️ 確認</h2>
                            <p className="modal-desc">
                                本当にリセットしますか？<br />
                                ストリークと履歴が全て消えます。
                            </p>
                            <div className="modal-btns">
                                <button
                                    className="modal-btn modal-btn--secondary"
                                    onClick={() => setShowResetConfirm(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className="modal-btn modal-btn--danger"
                                    onClick={handleReset}
                                >
                                    リセットする
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
}
