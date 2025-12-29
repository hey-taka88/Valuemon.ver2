'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore, REWARD_EXAMPLES } from '@/stores/habitStore';
import { useState } from 'react';

// ========================================
// HabitCard - 習慣進捗カード
// ========================================

interface HabitCardProps {
    compact?: boolean;  // ホーム画面用のコンパクト表示
    onComplete?: (result: { streakIncreased: boolean; newStreak: number; isNewRecord: boolean }) => void;
}

export default function HabitCard({ compact = false, onComplete }: HabitCardProps) {
    const {
        currentHabit,
        reward,
        streak,
        habitFormed,
        totalCompletions,
        longestStreak,
        completeToday,
        isCompletedToday,
    } = useHabitStore();

    const [showCelebration, setShowCelebration] = useState(false);

    if (!currentHabit) {
        return (
            <div className="habit-card habit-card--empty">
                <div className="habit-card__icon">🌱</div>
                <p className="habit-card__message">
                    習慣を設定して<br />継続の力を育てよう
                </p>
                <a href="/habit" className="habit-card__link">
                    習慣を設定する →
                </a>
            </div>
        );
    }

    const completed = isCompletedToday();

    const handleComplete = () => {
        if (completed) return;

        const result = completeToday();
        if (result.streakIncreased) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
        }
        onComplete?.(result);
    };

    if (compact) {
        return (
            <motion.div
                className={`habit-card habit-card--compact ${completed ? 'habit-card--completed' : ''}`}
                whileTap={{ scale: completed ? 1 : 0.98 }}
            >
                <div className="habit-card__header">
                    <span className="habit-card__emoji">
                        {habitFormed ? '🏆' : completed ? '✓' : '🔥'}
                    </span>
                    <span className="habit-card__name">{currentHabit}</span>
                </div>
                <div className="habit-card__streak">
                    {streak}日連続
                </div>
                {!completed && (
                    <button
                        className="habit-card__btn"
                        onClick={handleComplete}
                    >
                        達成！
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`habit-card ${completed ? 'habit-card--completed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        className="habit-card__celebration"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        🎉
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="habit-card__header">
                <div className="habit-card__icon-large">
                    {habitFormed ? '🏆' : '🔥'}
                </div>
                <div className="habit-card__info">
                    <h3 className="habit-card__title">{currentHabit}</h3>
                    <p className="habit-card__reward">
                        報酬: {reward}
                    </p>
                </div>
            </div>

            <div className="habit-card__stats">
                <div className="habit-card__stat">
                    <span className="habit-card__stat-value">{streak}</span>
                    <span className="habit-card__stat-label">連続日数</span>
                </div>
                <div className="habit-card__stat">
                    <span className="habit-card__stat-value">{totalCompletions}</span>
                    <span className="habit-card__stat-label">累計達成</span>
                </div>
                <div className="habit-card__stat">
                    <span className="habit-card__stat-value">{longestStreak}</span>
                    <span className="habit-card__stat-label">最長記録</span>
                </div>
            </div>

            {habitFormed && (
                <div className="habit-card__formed-badge">
                    ✨ 習慣化達成！
                </div>
            )}

            <motion.button
                className={`habit-card__complete-btn ${completed ? 'habit-card__complete-btn--done' : ''}`}
                onClick={handleComplete}
                disabled={completed}
                whileHover={!completed ? { scale: 1.02 } : {}}
                whileTap={!completed ? { scale: 0.98 } : {}}
            >
                {completed ? '✓ 今日は達成済み' : '今日の習慣を達成！'}
            </motion.button>
        </motion.div>
    );
}

// ========================================
// HabitSetupForm - 習慣設定フォーム
// ========================================

interface HabitSetupFormProps {
    onComplete?: () => void;
}

export function HabitSetupForm({ onComplete }: HabitSetupFormProps) {
    const { setHabit, currentHabit } = useHabitStore();
    const [habitName, setHabitName] = useState(currentHabit || '');
    const [reward, setReward] = useState('');
    const [step, setStep] = useState<'habit' | 'reward' | 'confirm'>('habit');

    const handleSubmit = () => {
        if (!habitName.trim() || !reward.trim()) return;
        setHabit(habitName.trim(), reward.trim());
        onComplete?.();
    };

    return (
        <div className="habit-setup">
            <AnimatePresence mode="wait">
                {step === 'habit' && (
                    <motion.div
                        key="habit"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="habit-setup__step"
                    >
                        <h2 className="habit-setup__title">
                            🎯 習慣を1つだけ決めよう
                        </h2>
                        <p className="habit-setup__desc">
                            「多様性は習慣化の敵」<br />
                            1つに集中することで確実に身につけます
                        </p>

                        <input
                            type="text"
                            className="habit-setup__input"
                            placeholder="例: 毎朝5分瞑想する"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            autoFocus
                        />

                        <button
                            className="habit-setup__btn"
                            onClick={() => setStep('reward')}
                            disabled={!habitName.trim()}
                        >
                            次へ →
                        </button>
                    </motion.div>
                )}

                {step === 'reward' && (
                    <motion.div
                        key="reward"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="habit-setup__step"
                    >
                        <h2 className="habit-setup__title">
                            🍬 報酬を設定しよう
                        </h2>
                        <p className="habit-setup__desc">
                            習慣の直後にできる<br />
                            小さなご褒美を決めましょう
                        </p>

                        <input
                            type="text"
                            className="habit-setup__input"
                            placeholder="例: 好きな音楽1曲"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                            autoFocus
                        />

                        <div className="habit-setup__examples">
                            {REWARD_EXAMPLES.map((example) => (
                                <button
                                    key={example}
                                    className="habit-setup__example"
                                    onClick={() => setReward(example)}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>

                        <div className="habit-setup__btns">
                            <button
                                className="habit-setup__btn habit-setup__btn--secondary"
                                onClick={() => setStep('habit')}
                            >
                                ← 戻る
                            </button>
                            <button
                                className="habit-setup__btn"
                                onClick={() => setStep('confirm')}
                                disabled={!reward.trim()}
                            >
                                次へ →
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'confirm' && (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="habit-setup__step"
                    >
                        <h2 className="habit-setup__title">
                            ✨ 確認
                        </h2>

                        <div className="habit-setup__summary">
                            <div className="habit-setup__summary-item">
                                <span className="habit-setup__summary-label">習慣</span>
                                <span className="habit-setup__summary-value">{habitName}</span>
                            </div>
                            <div className="habit-setup__summary-item">
                                <span className="habit-setup__summary-label">報酬</span>
                                <span className="habit-setup__summary-value">{reward}</span>
                            </div>
                        </div>

                        <p className="habit-setup__tip">
                            💡 報酬なしでも続くようになったら、習慣化完了です！
                        </p>

                        <div className="habit-setup__btns">
                            <button
                                className="habit-setup__btn habit-setup__btn--secondary"
                                onClick={() => setStep('reward')}
                            >
                                ← 戻る
                            </button>
                            <button
                                className="habit-setup__btn habit-setup__btn--primary"
                                onClick={handleSubmit}
                            >
                                始める！
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ========================================
// RewardTestModal - 報酬テストモーダル
// ========================================

interface RewardTestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RewardTestModal({ isOpen, onClose }: RewardTestModalProps) {
    const { currentHabit, reward, runRewardTest, streak } = useHabitStore();
    const [note, setNote] = useState('');

    const handleTest = (passed: boolean) => {
        runRewardTest(passed, note);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <h2 className="modal-title">🧪 習慣化テスト</h2>

                <p className="modal-desc">
                    {streak}日間お疲れ様でした！<br />
                    今日は<strong>{reward}</strong>なしで<br />
                    「{currentHabit}」を続けられましたか？
                </p>

                <textarea
                    className="modal-textarea"
                    placeholder="感想があれば記入（任意）"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="modal-btns">
                    <button
                        className="modal-btn modal-btn--success"
                        onClick={() => handleTest(true)}
                    >
                        ✓ できた！
                    </button>
                    <button
                        className="modal-btn modal-btn--secondary"
                        onClick={() => handleTest(false)}
                    >
                        まだ難しい
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
