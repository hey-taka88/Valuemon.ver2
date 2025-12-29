'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import type { EmotionType } from '@/types';

const PHASE_INFO: Record<EmotionType, { label: string; emoji: string }> = {
    envy: { label: '嫉妬', emoji: '💚' },
    rage: { label: '怒り', emoji: '🔥' },
    loss: { label: '喪失', emoji: '💔' },
};

const INITIAL_MESSAGES: Record<EmotionType, string> = {
    envy: `被告人、最初の尋問だ。
今から君の「嫉妬」について聞く。

嫉妬とは、本当は欲しいのに手に入らないものへの渇望だ。
この法廷では、それを隠す必要はない。

**質問：誰の、何が、許せないほど羨ましいか？**
SNSで見る誰か、身近な人間、有名人...誰でもいい。具体的に述べよ。`,

    rage: `次は「怒り」についてだ。
怒りとは、自分の中の「絶対に守りたいルール」が破られた時に発動する防衛機制だ。

**質問：絶対に許せない行動は何か？**
それを見ると、殴りたくなる、消し去りたくなる、そんな行為を述べよ。`,

    loss: `最後の尋問だ。これが最も核心に迫る。

想像しろ。今から全てを奪う。
金、地位、名誉、人間関係...順番に消えていく。

**質問：全てを奪われる時、最後まで手放さないものは何か？**
それだけは渡せない、それを失ったら自分が自分でなくなる、そんなものを述べよ。`,
};

function ShadowDiagnosisContent() {
    const router = useRouter();
    const { state, messages, addMessage, setPhase, setLoading, isLoading } = useDiagnosisStore();
    const [input, setInput] = useState('');
    const [questionCount, setQuestionCount] = useState(0);
    const [userResponses, setUserResponses] = useState<Record<EmotionType, string[]>>({
        envy: [],
        rage: [],
        loss: [],
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentPhase = state.currentPhase;
    const isComplete = currentPhase === 'complete';
    const phaseInfo = !isComplete ? PHASE_INFO[currentPhase as EmotionType] : null;

    // 初期メッセージを追加
    useEffect(() => {
        if (messages.length === 0 && currentPhase !== 'complete') {
            addMessage({
                role: 'ai',
                content: INITIAL_MESSAGES[currentPhase as EmotionType],
            });
        }
    }, []);

    // 自動スクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const callGeminiAPI = async (userMessage: string) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }],
                    phase: currentPhase,
                }),
            });

            if (!response.ok) {
                throw new Error('API error');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Gemini API error:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // ユーザーメッセージを追加
        addMessage({
            role: 'user',
            content: userMessage,
        });

        // 回答を保存
        const phase = currentPhase as EmotionType;
        setUserResponses(prev => ({
            ...prev,
            [phase]: [...prev[phase], userMessage],
        }));

        setLoading(true);
        const newQuestionCount = questionCount + 1;
        setQuestionCount(newQuestionCount);

        // 3回質問したら次のフェーズへ
        if (newQuestionCount >= 3) {
            const phases: EmotionType[] = ['envy', 'rage', 'loss'];
            const currentIndex = phases.indexOf(phase);

            if (currentIndex < phases.length - 1) {
                // 次のフェーズへ
                const nextPhase = phases[currentIndex + 1];

                setTimeout(() => {
                    addMessage({
                        role: 'ai',
                        content: `「${phaseInfo?.label || ''}」の尋問を完了した。\n\n次は「${PHASE_INFO[nextPhase].label}」だ。`,
                    });

                    setTimeout(() => {
                        setPhase(nextPhase);
                        setQuestionCount(0);
                        addMessage({
                            role: 'ai',
                            content: INITIAL_MESSAGES[nextPhase],
                        });
                        setLoading(false);
                    }, 1500);
                }, 1000);
            } else {
                // 診断完了
                setTimeout(() => {
                    setPhase('complete');
                    addMessage({
                        role: 'ai',
                        content: `証言は全て揃った。\n\n3つのシャドウから、君の価値観が浮かび上がってきた。\n\n「結果を見る」ボタンを押して、判決を受けよ。`,
                    });

                    // 回答をローカルストレージに保存（結果ページで使用）
                    // 最後の回答も含めるために直接現在の値を含める
                    const finalResponses = {
                        ...userResponses,
                        [phase]: [...userResponses[phase], userMessage],
                    };
                    localStorage.setItem('shadowResponses', JSON.stringify(finalResponses));
                    setLoading(false);
                }, 1000);
            }
        } else {
            // Gemini APIで次の質問を生成
            const aiResponse = await callGeminiAPI(userMessage);

            if (aiResponse) {
                addMessage({
                    role: 'ai',
                    content: aiResponse,
                });
            } else {
                // フォールバック：静的な質問
                const fallbackQuestions = [
                    'その詳細をもう少し掘り下げよ。具体的に何が問題なのか？',
                    'それが手に入ったら、君の人生はどう変わる？',
                ];
                addMessage({
                    role: 'ai',
                    content: fallbackQuestions[questionCount] || '続けよ。',
                });
            }

            setLoading(false);
        }
    };

    const goToResult = () => {
        router.push('/diagnosis/shadow/result');
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] flex flex-col">
            {/* ヘッダー */}
            <header className="p-4 border-b border-white/10">
                <Link href="/diagnosis" className="text-gray-400 text-sm">← モード選択</Link>
                <div className="flex items-center justify-between mt-2">
                    <h1 className="text-xl font-bold">シャドウ・プロファイリング</h1>
                    <span className="text-2xl">{!isComplete ? phaseInfo?.emoji : '✅'}</span>
                </div>

                {/* フェーズインジケーター */}
                <div className="flex items-center mt-3">
                    {(['envy', 'rage', 'loss'] as EmotionType[]).map((phase, index) => {
                        const phases: EmotionType[] = ['envy', 'rage', 'loss'];
                        const currentIndex = isComplete
                            ? 3
                            : phases.indexOf(currentPhase as EmotionType);

                        return (
                            <div key={phase} className="flex items-center">
                                <div className={`
                  w-3 h-3 rounded-full
                  ${index < currentIndex ? 'bg-[var(--accent-success)]' : ''}
                  ${index === currentIndex ? 'bg-[var(--flame-glow)] shadow-[0_0_10px_var(--flame-glow)]' : ''}
                  ${index > currentIndex ? 'bg-gray-600' : ''}
                `} />
                                <span className={`text-xs ml-1 ${index <= currentIndex ? 'text-white' : 'text-gray-500'}`}>
                                    {PHASE_INFO[phase].label}
                                </span>
                                {index < 2 && <div className="w-8 h-px bg-gray-600 mx-2" />}
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* チャットエリア */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}
                    >
                        {msg.role === 'ai' && (
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                                <span>⚖️</span>
                                <span>影の検察官</span>
                            </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-bubble-ai">
                        <div className="flex items-center gap-2">
                            <div className="animate-pulse">⚖️</div>
                            <span className="text-gray-400">考え中...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            {!isComplete ? (
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="回答を入力..."
                            disabled={isLoading}
                            className="flex-1 bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--flame-glow)] disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            送信
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={goToResult}
                        className="btn-primary w-full"
                    >
                        結果を見る →
                    </button>
                </div>
            )}
        </main>
    );
}

function LoadingFallback() {
    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--flame-glow)] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">読み込み中...</p>
            </div>
        </main>
    );
}

export default function ShadowDiagnosisPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ShadowDiagnosisContent />
        </Suspense>
    );
}
