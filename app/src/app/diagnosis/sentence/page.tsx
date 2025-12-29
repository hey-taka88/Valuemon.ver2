'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SENTENCE_CATEGORIES, TOTAL_QUESTIONS, SentenceCategory, SentenceQuestion } from '@/data/sentenceData';

interface Answer {
    questionId: string;
    categoryId: string;
    answer: string;
}

export default function SentenceDiagnosisPage() {
    const router = useRouter();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentCategory = SENTENCE_CATEGORIES[currentCategoryIndex];
    const currentQuestion = currentCategory?.questions[currentQuestionIndex];

    // 全体の進捗を計算
    const totalAnswered = answers.length;
    const progress = (totalAnswered / TOTAL_QUESTIONS) * 100;

    const handleSubmit = () => {
        if (!currentAnswer.trim()) return;

        // 回答を保存
        const newAnswer: Answer = {
            questionId: currentQuestion.id,
            categoryId: currentCategory.id,
            answer: currentAnswer.trim(),
        };
        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);
        setCurrentAnswer('');

        // 次の質問へ
        if (currentQuestionIndex < currentCategory.questions.length - 1) {
            // 同じカテゴリ内の次の質問
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentCategoryIndex < SENTENCE_CATEGORIES.length - 1) {
            // 次のカテゴリへ
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentCategoryIndex(currentCategoryIndex + 1);
                setCurrentQuestionIndex(0);
                setIsTransitioning(false);
            }, 500);
        } else {
            // 診断完了
            localStorage.setItem('sentenceResponses', JSON.stringify(newAnswers));
            router.push('/diagnosis/sentence/result');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!currentCategory || !currentQuestion) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] flex flex-col">
            {/* ヘッダー */}
            <header className="p-4 border-b border-white/10">
                <Link href="/diagnosis" className="text-gray-400 text-sm">← モード選択</Link>
                <div className="flex items-center justify-between mt-2">
                    <h1 className="text-xl font-bold">アンフィニッシュド・センテンス</h1>
                    <span className="text-2xl">{currentCategory.emoji}</span>
                </div>

                {/* カテゴリインジケーター */}
                <div className="flex items-center mt-3 gap-2">
                    {SENTENCE_CATEGORIES.map((cat, index) => (
                        <div
                            key={cat.id}
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm
                                transition-all duration-300
                                ${index < currentCategoryIndex ? 'bg-[var(--accent-success)]' : ''}
                                ${index === currentCategoryIndex ? 'bg-[var(--flame-glow)] shadow-[0_0_10px_var(--flame-glow)]' : ''}
                                ${index > currentCategoryIndex ? 'bg-gray-700' : ''}
                            `}
                        >
                            {index < currentCategoryIndex ? '✓' : cat.emoji}
                        </div>
                    ))}
                </div>

                {/* プログレスバー */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{currentCategory.name}</span>
                        <span>{totalAnswered + 1} / {TOTAL_QUESTIONS}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-300"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: currentCategory.color,
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* 質問エリア */}
            <div className={`flex-1 flex flex-col justify-center p-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {/* カテゴリタイトル */}
                <div className="text-center mb-8">
                    <span
                        className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: currentCategory.color + '30', color: currentCategory.color }}
                    >
                        {currentCategory.emoji} {currentCategory.name}について
                    </span>
                </div>

                {/* 文章穴埋め */}
                <div className="card card-glow max-w-lg mx-auto w-full">
                    <p className="text-lg mb-4 leading-relaxed">
                        <span className="text-gray-300">{currentQuestion.prefix}</span>
                        <span className="inline-block mx-1 border-b-2 border-[var(--flame-glow)] min-w-[120px] text-center">
                            {currentAnswer || '＿＿＿＿'}
                        </span>
                        <span className="text-gray-300">{currentQuestion.suffix}</span>
                    </p>

                    <input
                        type="text"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentQuestion.placeholder}
                        autoFocus
                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--flame-glow)] text-center text-lg"
                    />
                </div>

                {/* 質問番号 */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                    質問 {currentQuestionIndex + 1} / {currentCategory.questions.length}
                </div>
            </div>

            {/* 送信ボタン */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentCategoryIndex === SENTENCE_CATEGORIES.length - 1 &&
                        currentQuestionIndex === currentCategory.questions.length - 1
                        ? '結果を見る →'
                        : '次へ →'}
                </button>
            </div>
        </main>
    );
}
