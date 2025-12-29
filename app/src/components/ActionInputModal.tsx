'use client';

import { useState } from 'react';
import type { LifeArea } from '@/types';
import { LIFE_AREAS } from '@/data/actionData';

interface ActionInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goalText: string, area: LifeArea) => void;
}

export default function ActionInputModal({ isOpen, onClose, onSave }: ActionInputModalProps) {
    const [goalText, setGoalText] = useState('');
    const [selectedArea, setSelectedArea] = useState<LifeArea>('growth');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!goalText.trim()) return;
        onSave(goalText.trim(), selectedArea);
        setGoalText('');
        onClose();
    };

    const areas = Object.entries(LIFE_AREAS) as [LifeArea, typeof LIFE_AREAS[LifeArea]][];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl w-full max-w-md border border-[var(--flame-glow)]/30 shadow-2xl">
                {/* ヘッダー */}
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-center bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] bg-clip-text text-transparent">
                        🎯 今日の目標行動
                    </h2>
                    <p className="text-sm text-gray-400 text-center mt-1">
                        シンプルに1つだけ。これだけやればOK！
                    </p>
                </div>

                {/* コンテンツ */}
                <div className="p-4 space-y-4">
                    {/* 行動入力 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            何をする？
                        </label>
                        <input
                            type="text"
                            value={goalText}
                            onChange={(e) => setGoalText(e.target.value)}
                            placeholder="例: 朝10分だけストレッチする"
                            className="w-full px-4 py-3 bg-[var(--bg-abyss)] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-[var(--flame-glow)] focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* カテゴリ選択 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            カテゴリ
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {areas.map(([key, area]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedArea(key)}
                                    className={`p-2 rounded-lg border transition-all text-center ${selectedArea === key
                                            ? 'border-[var(--flame-glow)] bg-[var(--flame-glow)]/20 text-[var(--flame-glow)]'
                                            : 'border-gray-600 hover:border-gray-500 text-gray-400'
                                        }`}
                                >
                                    <span className="text-xl">{area.emoji}</span>
                                    <span className="block text-xs mt-1">{area.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* フッター */}
                <div className="p-4 border-t border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!goalText.trim()}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--flame-glow)]/30 transition-all"
                    >
                        設定する ✨
                    </button>
                </div>
            </div>
        </div>
    );
}
