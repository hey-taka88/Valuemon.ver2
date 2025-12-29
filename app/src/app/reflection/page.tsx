'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { WeeklyReflectionForm } from '@/components/ReflectionModal';
import { useReflectionStore, DIRECTION_LABELS } from '@/stores/reflectionStore';

export default function ReflectionPage() {
    const {
        getLatestEntries,
        hasReflectedThisWeek,
        getWeeklyAverageRating,
    } = useReflectionStore();

    const [showWeekly, setShowWeekly] = useState(false);
    const [completedWeekly, setCompletedWeekly] = useState(false);

    const entries = getLatestEntries(10);
    const weeklyAvg = getWeeklyAverageRating();
    const hasWeekly = hasReflectedThisWeek();

    const handleWeeklyComplete = () => {
        setShowWeekly(false);
        setCompletedWeekly(true);
    };

    return (
        <div className="reflection-page">
            <header className="reflection-page__header">
                <h1 className="reflection-page__title">
                    🪞 ふりかえり
                </h1>
                <p className="reflection-page__subtitle">
                    行動を評価し、次の一手につなげる
                </p>
            </header>

            <main className="reflection-page__main">
                {showWeekly ? (
                    <WeeklyReflectionForm onComplete={handleWeeklyComplete} />
                ) : (
                    <>
                        {/* 週次振り返りCTA */}
                        {!hasWeekly && !completedWeekly && (
                            <motion.div
                                className="reflection-page__weekly-cta"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="reflection-page__weekly-icon">📅</div>
                                <div className="reflection-page__weekly-info">
                                    <h3>週次振り返りをしよう</h3>
                                    <p>意味づけ質問で、より深い自己理解へ</p>
                                </div>
                                <button
                                    className="reflection-page__weekly-btn"
                                    onClick={() => setShowWeekly(true)}
                                >
                                    始める
                                </button>
                            </motion.div>
                        )}

                        {/* 完了メッセージ */}
                        {(hasWeekly || completedWeekly) && (
                            <div className="reflection-page__completed">
                                <span>✓</span> 今週の振り返り完了！
                            </div>
                        )}

                        {/* 週間サマリー */}
                        {weeklyAvg > 0 && (
                            <div className="reflection-page__summary">
                                <h3 className="reflection-page__summary-title">
                                    📊 今週のサマリー
                                </h3>
                                <div className="reflection-page__summary-stat">
                                    <span className="reflection-page__summary-label">
                                        平均方向性スコア
                                    </span>
                                    <span className="reflection-page__summary-value">
                                        {weeklyAvg.toFixed(1)} / 5.0
                                    </span>
                                </div>
                                <div className="reflection-page__summary-bar">
                                    <div
                                        className="reflection-page__summary-fill"
                                        style={{ width: `${(weeklyAvg / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 振り返り履歴 */}
                        <div className="reflection-page__history">
                            <h3 className="reflection-page__history-title">
                                📝 振り返り履歴
                            </h3>

                            {entries.length === 0 ? (
                                <div className="reflection-page__empty">
                                    <p>まだ振り返りがありません</p>
                                    <p className="reflection-page__empty-hint">
                                        クエストを達成すると振り返りができます
                                    </p>
                                </div>
                            ) : (
                                <div className="reflection-page__list">
                                    {entries.map((entry) => (
                                        <motion.div
                                            key={entry.id}
                                            className={`reflection-page__entry reflection-page__entry--${entry.type}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="reflection-page__entry-header">
                                                <span className="reflection-page__entry-date">
                                                    {new Date(entry.date).toLocaleDateString('ja-JP', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        weekday: 'short',
                                                    })}
                                                </span>
                                                <span className={`reflection-page__entry-badge ${entry.type}`}>
                                                    {entry.type === 'weekly' ? '週次' : '日次'}
                                                </span>
                                            </div>

                                            <div className="reflection-page__entry-rating">
                                                <span className="reflection-page__entry-emoji">
                                                    {DIRECTION_LABELS[entry.actionEvaluation.direction].emoji}
                                                </span>
                                                <span className="reflection-page__entry-direction">
                                                    {DIRECTION_LABELS[entry.actionEvaluation.direction].label}
                                                </span>
                                            </div>

                                            {entry.actionEvaluation.comment && (
                                                <p className="reflection-page__entry-comment">
                                                    {entry.actionEvaluation.comment}
                                                </p>
                                            )}

                                            {entry.nextStep && (
                                                <div className="reflection-page__entry-next">
                                                    <span>→</span> {entry.nextStep}
                                                </div>
                                            )}

                                            {entry.meaning && (
                                                <div className="reflection-page__entry-meaning">
                                                    <div className="reflection-page__entry-meaning-item">
                                                        <span className="label">理想の世界:</span>
                                                        <span>{entry.meaning.worldIdeal}</span>
                                                    </div>
                                                    <div className="reflection-page__entry-meaning-item">
                                                        <span className="label">私の貢献:</span>
                                                        <span>{entry.meaning.myContribution}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
