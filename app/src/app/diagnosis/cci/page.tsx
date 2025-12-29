'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import MysticalButton from '@/components/MysticalButton';
import MysticalCard from '@/components/MysticalCard';
import { CCI_QUESTIONS } from '@/data/cciData';
import type { CCIResponse, CCIAnalysisResult } from '@/data/cciData';

export default function CCIDiagnosisPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<CCIResponse[]>([]);
    const [currentInputs, setCurrentInputs] = useState<string[]>(['']);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<CCIAnalysisResult | null>(null);

    const currentQuestion = CCI_QUESTIONS[currentStep];
    const isLastQuestion = currentStep === CCI_QUESTIONS.length - 1;

    const addInput = () => {
        if (currentInputs.length < (currentQuestion?.maxResponses || 3)) {
            setCurrentInputs([...currentInputs, '']);
        }
    };

    const updateInput = (index: number, value: string) => {
        const newInputs = [...currentInputs];
        newInputs[index] = value;
        setCurrentInputs(newInputs);
    };

    const removeInput = (index: number) => {
        if (currentInputs.length > 1) {
            setCurrentInputs(currentInputs.filter((_, i) => i !== index));
        }
    };

    const handleNext = async () => {
        // 現在の回答を保存
        const validResponses = currentInputs.filter(r => r.trim());
        if (validResponses.length === 0) return;

        const newResponses = [
            ...responses,
            { questionId: currentQuestion.id, responses: validResponses },
        ];
        setResponses(newResponses);

        if (isLastQuestion) {
            // 分析開始
            setAnalyzing(true);
            try {
                const res = await fetch('/api/analyze-cci', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ responses: newResponses }),
                });
                const data = await res.json();
                if (data.success) {
                    setResult(data.analysis);
                }
            } catch (error) {
                console.error('CCI analysis error:', error);
            } finally {
                setAnalyzing(false);
            }
        } else {
            setCurrentStep(currentStep + 1);
            setCurrentInputs(['']);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            const prevResponse = responses[currentStep - 1];
            if (prevResponse) {
                setCurrentInputs(prevResponse.responses);
                setResponses(responses.slice(0, -1));
            }
        }
    };

    // 結果表示
    if (result) {
        return (
            <div className="cci-page">
                <header className="cci-page__header">
                    <h1 className="cci-page__title">🔮 分析結果</h1>
                    <p className="cci-page__subtitle">あなたの人生テーマ</p>
                </header>

                <main className="cci-page__main">
                    {/* 人生のナラティブ */}
                    <MysticalCard glowColor="gold">
                        <h3 className="cci-result__section-title">📖 あなたの物語</h3>
                        <p className="cci-result__narrative">{result.lifeNarrative}</p>
                    </MysticalCard>

                    {/* コア価値観 */}
                    <div className="cci-result__values">
                        <h3 className="cci-result__section-title">💎 コア価値観</h3>
                        <div className="cci-result__value-list">
                            {result.coreValues.map((value, i) => (
                                <span key={i} className="cci-result__value-tag">
                                    {value}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* テーマ */}
                    <div className="cci-result__themes">
                        <h3 className="cci-result__section-title">🌟 発見されたテーマ</h3>
                        {result.themes.map((theme, i) => (
                            <div key={i} className="cci-result__theme">
                                <div className="cci-result__theme-header">
                                    <span className="cci-result__theme-name">{theme.name}</span>
                                    <span className="cci-result__theme-freq">
                                        {'★'.repeat(theme.frequency)}
                                    </span>
                                </div>
                                <p className="cci-result__theme-desc">{theme.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* キャリアアドバイス */}
                    <MysticalCard>
                        <h3 className="cci-result__section-title">💼 キャリアへのヒント</h3>
                        <p className="cci-result__advice">{result.careerAdvice}</p>
                    </MysticalCard>

                    <div className="cci-result__actions">
                        <MysticalButton
                            onClick={() => router.push('/diagnosis')}
                            glowColor="blue"
                        >
                            診断メニューに戻る
                        </MysticalButton>
                    </div>
                </main>

                <BottomNav />
            </div>
        );
    }

    // 分析中
    if (analyzing) {
        return (
            <div className="cci-page cci-page--analyzing">
                <div className="cci-analyzing">
                    <motion.div
                        className="cci-analyzing__icon"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        🔮
                    </motion.div>
                    <h2>分析中...</h2>
                    <p>あなたの回答から人生テーマを抽出しています</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    // 質問表示
    return (
        <div className="cci-page">
            <header className="cci-page__header">
                <h1 className="cci-page__title">🎭 CCI診断</h1>
                <p className="cci-page__subtitle">
                    キャリア構築インタビュー
                </p>
                <div className="cci-page__progress">
                    {CCI_QUESTIONS.map((_, i) => (
                        <div
                            key={i}
                            className={`cci-page__progress-dot ${i < currentStep ? 'completed' :
                                i === currentStep ? 'active' : ''
                                }`}
                        />
                    ))}
                </div>
            </header>

            <main className="cci-page__main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="cci-question"
                    >
                        <div className="cci-question__number">
                            Q{currentStep + 1} / {CCI_QUESTIONS.length}
                        </div>
                        <h2 className="cci-question__title">
                            {currentQuestion.title}
                        </h2>
                        <p className="cci-question__text">
                            {currentQuestion.question}
                        </p>
                        <p className="cci-question__desc">
                            {currentQuestion.description}
                        </p>

                        <div className="cci-question__inputs">
                            {currentInputs.map((input, i) => (
                                <div key={i} className="cci-question__input-row">
                                    <textarea
                                        value={input}
                                        onChange={(e) => updateInput(i, e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        className="cci-question__textarea"
                                        rows={3}
                                    />
                                    {currentInputs.length > 1 && (
                                        <button
                                            onClick={() => removeInput(i)}
                                            className="cci-question__remove-btn"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            {currentInputs.length < (currentQuestion.maxResponses || 3) && (
                                <button
                                    onClick={addInput}
                                    className="cci-question__add-btn"
                                >
                                    + もう一つ追加
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="cci-question__nav">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="cci-question__nav-btn cci-question__nav-btn--back"
                        >
                            ← 戻る
                        </button>
                    )}
                    <MysticalButton
                        onClick={handleNext}
                        disabled={!currentInputs.some(r => r.trim())}
                        glowColor={isLastQuestion ? 'gold' : 'blue'}
                    >
                        {isLastQuestion ? '分析する' : '次へ →'}
                    </MysticalButton>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
