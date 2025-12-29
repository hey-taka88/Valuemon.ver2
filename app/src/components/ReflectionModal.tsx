'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useReflectionStore, DIRECTION_LABELS } from '@/stores/reflectionStore';

// ========================================
// ReflectionModal - クイック振り返りモーダル
// ========================================
// アクション完了後に表示される簡易版

interface ReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionName?: string;
}

export function ReflectionModal({ isOpen, onClose, actionName }: ReflectionModalProps) {
    const { addDailyReflection } = useReflectionStore();
    const [direction, setDirection] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [comment, setComment] = useState('');
    const [nextStep, setNextStep] = useState('');

    const handleSubmit = () => {
        addDailyReflection({
            actionEvaluation: { direction, comment },
            nextStep,
        });

        // リセット
        setDirection(3);
        setComment('');
        setNextStep('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-content reflection-modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <h2 className="modal-title">🪞 ふりかえり</h2>

                {actionName && (
                    <p className="reflection-modal__action">
                        「{actionName}」を達成しました
                    </p>
                )}

                <div className="reflection-modal__question">
                    <label>この行動は進みたい方向へ導いている？</label>
                    <div className="reflection-modal__ratings">
                        {([1, 2, 3, 4, 5] as const).map((value) => (
                            <button
                                key={value}
                                className={`reflection-modal__rating ${direction === value ? 'active' : ''}`}
                                onClick={() => setDirection(value)}
                            >
                                <span className="reflection-modal__rating-emoji">
                                    {DIRECTION_LABELS[value].emoji}
                                </span>
                                <span className="reflection-modal__rating-label">
                                    {value}
                                </span>
                            </button>
                        ))}
                    </div>
                    <p className="reflection-modal__rating-desc">
                        {DIRECTION_LABELS[direction].label}
                    </p>
                </div>

                <div className="reflection-modal__question">
                    <label>気づいたこと（任意）</label>
                    <textarea
                        className="reflection-modal__textarea"
                        placeholder="うまくいった点、改善点など"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                    />
                </div>

                <div className="reflection-modal__question">
                    <label>次の一手は？</label>
                    <input
                        type="text"
                        className="reflection-modal__input"
                        placeholder="明日やること"
                        value={nextStep}
                        onChange={(e) => setNextStep(e.target.value)}
                    />
                </div>

                <div className="modal-btns">
                    <button
                        className="modal-btn modal-btn--secondary"
                        onClick={onClose}
                    >
                        スキップ
                    </button>
                    <button
                        className="modal-btn modal-btn--primary"
                        onClick={handleSubmit}
                    >
                        記録する
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ========================================
// WeeklyReflectionForm - 週次振り返りフォーム
// ========================================

interface WeeklyReflectionFormProps {
    onComplete?: () => void;
}

export function WeeklyReflectionForm({ onComplete }: WeeklyReflectionFormProps) {
    const { addWeeklyReflection, getWeeklyAverageRating } = useReflectionStore();
    const [step, setStep] = useState<'meaning' | 'if' | 'summary'>('meaning');

    // 意味づけ質問
    const [worldIdeal, setWorldIdeal] = useState('');
    const [myContribution, setMyContribution] = useState('');

    // もしも視点
    const [idealLife, setIdealLife] = useState('');
    const [conditions, setConditions] = useState<string[]>(['']);
    const [thisWeekAction, setThisWeekAction] = useState('');

    // まとめ
    const [direction, setDirection] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [comment, setComment] = useState('');
    const [nextStep, setNextStep] = useState('');

    const weeklyAvg = getWeeklyAverageRating();

    const addCondition = () => {
        setConditions([...conditions, '']);
    };

    const updateCondition = (index: number, value: string) => {
        const newConditions = [...conditions];
        newConditions[index] = value;
        setConditions(newConditions);
    };

    const handleSubmit = () => {
        addWeeklyReflection({
            actionEvaluation: { direction, comment },
            nextStep,
            meaning: {
                worldIdeal,
                myContribution,
            },
            ifPerspective: {
                idealLife,
                requiredConditions: conditions.filter(c => c.trim()),
                thisWeekAction,
            },
        });
        onComplete?.();
    };

    return (
        <div className="weekly-reflection">
            <AnimatePresence mode="wait">
                {step === 'meaning' && (
                    <motion.div
                        key="meaning"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="weekly-reflection__step"
                    >
                        <h2 className="weekly-reflection__title">
                            🌍 意味づけ質問
                        </h2>
                        <p className="weekly-reflection__desc">
                            取り組みに意味を見出すことで、やりがいと粘りが増します
                        </p>

                        <div className="weekly-reflection__question">
                            <label>世の中はどうなるべきか？（理想の状態）</label>
                            <textarea
                                className="weekly-reflection__textarea"
                                placeholder="例: 誰もが自分らしく生きられる社会"
                                value={worldIdeal}
                                onChange={(e) => setWorldIdeal(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="weekly-reflection__question">
                            <label>そのために自分は何で貢献できる？</label>
                            <textarea
                                className="weekly-reflection__textarea"
                                placeholder="例: 自分の経験を発信して、同じ悩みを持つ人を励ます"
                                value={myContribution}
                                onChange={(e) => setMyContribution(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <button
                            className="weekly-reflection__btn"
                            onClick={() => setStep('if')}
                            disabled={!worldIdeal.trim() || !myContribution.trim()}
                        >
                            次へ →
                        </button>
                    </motion.div>
                )}

                {step === 'if' && (
                    <motion.div
                        key="if"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="weekly-reflection__step"
                    >
                        <h2 className="weekly-reflection__title">
                            ✨ もしも視点
                        </h2>
                        <p className="weekly-reflection__desc">
                            理想から逆算して、今週の一手を決めましょう
                        </p>

                        <div className="weekly-reflection__question">
                            <label>理想の生活を想像すると？</label>
                            <textarea
                                className="weekly-reflection__textarea"
                                placeholder="例: 毎朝自然の中で瞑想し、好きな仕事に集中できる"
                                value={idealLife}
                                onChange={(e) => setIdealLife(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="weekly-reflection__question">
                            <label>それに必要な条件は？</label>
                            {conditions.map((condition, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    className="weekly-reflection__input"
                                    placeholder={`条件 ${i + 1}`}
                                    value={condition}
                                    onChange={(e) => updateCondition(i, e.target.value)}
                                />
                            ))}
                            <button
                                className="weekly-reflection__add-btn"
                                onClick={addCondition}
                            >
                                + 条件を追加
                            </button>
                        </div>

                        <div className="weekly-reflection__question">
                            <label>今週の一手（具体的な行動）</label>
                            <input
                                type="text"
                                className="weekly-reflection__input"
                                placeholder="例: 毎朝5分の瞑想を始める"
                                value={thisWeekAction}
                                onChange={(e) => setThisWeekAction(e.target.value)}
                            />
                        </div>

                        <div className="weekly-reflection__btns">
                            <button
                                className="weekly-reflection__btn weekly-reflection__btn--secondary"
                                onClick={() => setStep('meaning')}
                            >
                                ← 戻る
                            </button>
                            <button
                                className="weekly-reflection__btn"
                                onClick={() => setStep('summary')}
                            >
                                次へ →
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'summary' && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="weekly-reflection__step"
                    >
                        <h2 className="weekly-reflection__title">
                            📊 今週のまとめ
                        </h2>

                        {weeklyAvg > 0 && (
                            <div className="weekly-reflection__avg">
                                <span>今週の平均評価:</span>
                                <span className="weekly-reflection__avg-value">
                                    {weeklyAvg.toFixed(1)} / 5.0
                                </span>
                            </div>
                        )}

                        <div className="weekly-reflection__question">
                            <label>全体的に進みたい方向へ向かえた？</label>
                            <div className="reflection-modal__ratings">
                                {([1, 2, 3, 4, 5] as const).map((value) => (
                                    <button
                                        key={value}
                                        className={`reflection-modal__rating ${direction === value ? 'active' : ''}`}
                                        onClick={() => setDirection(value)}
                                    >
                                        <span className="reflection-modal__rating-emoji">
                                            {DIRECTION_LABELS[value].emoji}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="weekly-reflection__question">
                            <label>今週の学び・気づき</label>
                            <textarea
                                className="weekly-reflection__textarea"
                                placeholder="うまくいったこと、改善点"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="weekly-reflection__question">
                            <label>来週への宣言</label>
                            <input
                                type="text"
                                className="weekly-reflection__input"
                                placeholder="来週達成したいこと"
                                value={nextStep}
                                onChange={(e) => setNextStep(e.target.value)}
                            />
                        </div>

                        <div className="weekly-reflection__btns">
                            <button
                                className="weekly-reflection__btn weekly-reflection__btn--secondary"
                                onClick={() => setStep('if')}
                            >
                                ← 戻る
                            </button>
                            <button
                                className="weekly-reflection__btn weekly-reflection__btn--primary"
                                onClick={handleSubmit}
                            >
                                完了！
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
