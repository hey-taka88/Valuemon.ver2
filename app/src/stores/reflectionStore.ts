import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========================================
// 内省モジュール - 行動評価と振り返り
// ========================================
// 「反省会」にならないよう、意思決定と行動に接続

// 週次意味づけ質問
export interface MeaningQuestion {
    worldIdeal: string;     // 世の中はどうなるべきか？
    myContribution: string; // そのために自分は何で貢献できるか？
}

// 振り返りエントリー
export interface ReflectionEntry {
    id: string;
    date: string;
    type: 'daily' | 'weekly';

    // 行動評価
    actionEvaluation: {
        direction: 1 | 2 | 3 | 4 | 5;  // 進みたい方向へ導いているか？
        comment: string;
    };

    // 創造的な代案
    creativeAlternative?: string;

    // 次の一手
    nextStep: string;

    // 週次のみ: 意味づけ質問
    meaning?: MeaningQuestion;

    // もしも視点（週次）
    ifPerspective?: {
        idealLife: string;         // 理想の生活
        requiredConditions: string[]; // 必要な条件
        thisWeekAction: string;    // 今週の行動
    };
}

interface ReflectionState {
    entries: ReflectionEntry[];
    lastDailyDate: string | null;
    lastWeeklyDate: string | null;
}

interface ReflectionActions {
    // 日次振り返り追加
    addDailyReflection: (entry: Omit<ReflectionEntry, 'id' | 'date' | 'type'>) => void;

    // 週次振り返り追加
    addWeeklyReflection: (entry: Omit<ReflectionEntry, 'id' | 'date' | 'type'>) => void;

    // 今日の振り返り済みか
    hasReflectedToday: () => boolean;

    // 今週の振り返り済みか
    hasReflectedThisWeek: () => boolean;

    // 最新のエントリー取得
    getLatestEntries: (count: number) => ReflectionEntry[];

    // 週間の平均評価を取得
    getWeeklyAverageRating: () => number;
}

type ReflectionStore = ReflectionState & ReflectionActions;

// 今日の日付文字列
const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 今週の開始日文字列（日曜始まり）
const getWeekStartString = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    return `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
};

// UUID生成
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useReflectionStore = create<ReflectionStore>()(
    persist(
        (set, get) => ({
            entries: [],
            lastDailyDate: null,
            lastWeeklyDate: null,

            // 日次振り返り追加
            addDailyReflection: (entry) => {
                const today = getTodayString();
                const newEntry: ReflectionEntry = {
                    ...entry,
                    id: generateId(),
                    date: today,
                    type: 'daily',
                };

                set((state) => ({
                    entries: [...state.entries, newEntry],
                    lastDailyDate: today,
                }));
            },

            // 週次振り返り追加
            addWeeklyReflection: (entry) => {
                const today = getTodayString();
                const newEntry: ReflectionEntry = {
                    ...entry,
                    id: generateId(),
                    date: today,
                    type: 'weekly',
                };

                set((state) => ({
                    entries: [...state.entries, newEntry],
                    lastWeeklyDate: today,
                }));
            },

            // 今日の振り返り済みか
            hasReflectedToday: () => {
                const state = get();
                return state.lastDailyDate === getTodayString();
            },

            // 今週の振り返り済みか
            hasReflectedThisWeek: () => {
                const state = get();
                if (!state.lastWeeklyDate) return false;

                const weekStart = getWeekStartString();
                return state.lastWeeklyDate >= weekStart;
            },

            // 最新のエントリー取得
            getLatestEntries: (count) => {
                const state = get();
                return state.entries.slice(-count).reverse();
            },

            // 週間の平均評価を取得
            getWeeklyAverageRating: () => {
                const state = get();
                const weekStart = getWeekStartString();
                const weekEntries = state.entries.filter(
                    e => e.date >= weekStart && e.actionEvaluation
                );

                if (weekEntries.length === 0) return 0;

                const sum = weekEntries.reduce(
                    (acc, e) => acc + e.actionEvaluation.direction,
                    0
                );
                return sum / weekEntries.length;
            },
        }),
        {
            name: 'reflection-storage',
        }
    )
);

// 評価ラベル
export const DIRECTION_LABELS = {
    1: { emoji: '😰', label: '全く違う方向' },
    2: { emoji: '😕', label: '少しずれている' },
    3: { emoji: '😐', label: 'どちらとも' },
    4: { emoji: '🙂', label: '概ね良い方向' },
    5: { emoji: '😄', label: '完璧な方向' },
} as const;
