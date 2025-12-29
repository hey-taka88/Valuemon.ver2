'use client';

import { useState } from 'react';

interface ObstacleModalProps {
    isOpen: boolean;
    goalText: string;
    onClose: () => void;
    onSubmit: (obstacle: string) => Promise<void>;
    loading?: boolean;
    result?: {
        ifThenPlan: string;
        suggestions: string[];
    };
}

export default function ObstacleModal({
    isOpen,
    goalText,
    onClose,
    onSubmit,
    loading = false,
    result,
}: ObstacleModalProps) {
    const [obstacle, setObstacle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!obstacle.trim()) return;
        await onSubmit(obstacle.trim());
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl w-full max-w-md border border-amber-500/30 shadow-2xl max-h-[80vh] overflow-y-auto">
                {/* ヘッダー */}
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-center text-amber-400">
                        😓 うまくいかない？
                    </h2>
                    <p className="text-sm text-gray-400 text-center mt-1">
                        大丈夫、一緒に解決策を考えよう
                    </p>
                </div>

                {/* コンテンツ */}
                <div className="p-4 space-y-4">
                    {/* 現在の目標 */}
                    <div className="px-3 py-2 rounded-lg bg-[var(--bg-abyss)]">
                        <p className="text-xs text-gray-400">今日の目標</p>
                        <p className="text-white">{goalText}</p>
                    </div>

                    {!result ? (
                        <>
                            {/* 障害入力 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    何が邪魔してる？何が難しい？
                                </label>
                                <textarea
                                    value={obstacle}
                                    onChange={(e) => setObstacle(e.target.value)}
                                    placeholder="例: 朝起きられない、やる気が出ない、時間がない..."
                                    className="w-full px-4 py-3 bg-[var(--bg-abyss)] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                                    rows={3}
                                    autoFocus
                                />
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!obstacle.trim() || loading}
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            分析中...
                                        </>
                                    ) : (
                                        <>
                                            🎯 解決策を提案
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* AI結果表示 */}
                            <div className="space-y-4">
                                <div className="px-4 py-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                                    <p className="text-xs text-blue-400 mb-2">💡 If-Thenプラン</p>
                                    <p className="text-white whitespace-pre-wrap">{result.ifThenPlan}</p>
                                </div>

                                {result.suggestions.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">🛠️ 行動の修正案</p>
                                        <ul className="space-y-2">
                                            {result.suggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="px-3 py-2 rounded-lg bg-[var(--bg-abyss)] text-sm text-gray-300 flex items-start gap-2"
                                                >
                                                    <span className="text-[var(--flame-glow)]">•</span>
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] text-white font-bold hover:shadow-lg transition-all"
                            >
                                了解！やってみる 💪
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
