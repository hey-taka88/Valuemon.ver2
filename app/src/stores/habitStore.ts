import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomVariant } from '@/data/monsterVariants';

// ========================================
// 習慣化モジュール - "多様性は習慣化の敵"
// ========================================
// 1つの習慣に絞り、報酬設計と習慣化判定をサポート

// 報酬テスト結果
interface RewardTestResult {
    date: string;
    passed: boolean;
    note?: string;
}

interface HabitState {
    // 現在の習慣（1つのみに集中）
    currentHabit: string | null;
    reward: string;                      // 設定された報酬
    streak: number;                      // 連続達成日数
    lastCompletedDate: string | null;    // 最後に達成した日付

    // モンスター連携
    monsterVariantId: string | null;     // 育成中のモンスター種類

    // 習慣化判定
    rewardTestHistory: RewardTestResult[]; // 報酬テストの履歴
    habitFormed: boolean;                // 報酬なしでも継続できるか

    // 統計
    totalCompletions: number;            // 累計達成回数
    longestStreak: number;               // 最長ストリーク
}

interface HabitActions {
    // 習慣設定
    setHabit: (name: string, reward: string) => void;

    // 今日の達成記録
    completeToday: () => {
        streakIncreased: boolean;
        newStreak: number;
        isNewRecord: boolean;
    };

    // 報酬テスト（週1実施）
    runRewardTest: (passed: boolean, note?: string) => void;

    // 習慣リセット
    resetHabit: () => void;

    // 今日達成済みか
    isCompletedToday: () => boolean;

    // 報酬テストが必要か（週1）
    needsRewardTest: () => boolean;
}

type HabitStore = HabitState & HabitActions;

// 今日の日付文字列を取得
const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 昨日の日付文字列を取得
const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
};

// 報酬例
export const REWARD_EXAMPLES = [
    '好きな音楽1曲',
    'コーヒーを飲む',
    '5分散歩',
    '甘いものを食べる',
    'SNSを5分だけ見る',
    'ストレッチする',
    '深呼吸3回',
];

export const useHabitStore = create<HabitStore>()(
    persist(
        (set, get) => ({
            // 初期状態
            currentHabit: null,
            reward: '',
            streak: 0,
            lastCompletedDate: null,
            monsterVariantId: null,
            rewardTestHistory: [],
            habitFormed: false,
            totalCompletions: 0,
            longestStreak: 0,

            // 習慣設定
            setHabit: (name, reward) => {
                // 新しい習慣にはランダムなモンスターを割り当て
                const variant = getRandomVariant();
                set({
                    currentHabit: name,
                    reward,
                    streak: 0,
                    lastCompletedDate: null,
                    monsterVariantId: variant.id,
                    rewardTestHistory: [],
                    habitFormed: false,
                });
            },

            // 今日の達成記録
            completeToday: () => {
                const state = get();
                const today = getTodayString();
                const yesterday = getYesterdayString();

                // 既に今日達成済みならスキップ
                if (state.lastCompletedDate === today) {
                    return {
                        streakIncreased: false,
                        newStreak: state.streak,
                        isNewRecord: false
                    };
                }

                // ストリーク計算
                let newStreak = 1;
                if (state.lastCompletedDate === yesterday) {
                    // 昨日も達成していればストリーク継続
                    newStreak = state.streak + 1;
                }

                const isNewRecord = newStreak > state.longestStreak;

                set({
                    lastCompletedDate: today,
                    streak: newStreak,
                    totalCompletions: state.totalCompletions + 1,
                    longestStreak: isNewRecord ? newStreak : state.longestStreak,
                });

                return {
                    streakIncreased: true,
                    newStreak,
                    isNewRecord
                };
            },

            // 報酬テスト（週1実施）
            // 「報酬がない日でも続くか？」を確認
            runRewardTest: (passed, note) => {
                const today = getTodayString();
                const state = get();

                const newResult: RewardTestResult = {
                    date: today,
                    passed,
                    note,
                };

                // 3回連続でパスしたら習慣化完了
                const newHistory = [...state.rewardTestHistory, newResult];
                const recentTests = newHistory.slice(-3);
                const isFormed = recentTests.length >= 3 &&
                    recentTests.every(t => t.passed);

                set({
                    rewardTestHistory: newHistory,
                    habitFormed: isFormed,
                });
            },

            // 習慣リセット
            resetHabit: () => {
                set({
                    currentHabit: null,
                    reward: '',
                    streak: 0,
                    lastCompletedDate: null,
                    rewardTestHistory: [],
                    habitFormed: false,
                });
            },

            // 今日達成済みか
            isCompletedToday: () => {
                const state = get();
                return state.lastCompletedDate === getTodayString();
            },

            // 報酬テストが必要か（週1 = 日曜日）
            needsRewardTest: () => {
                const state = get();
                if (!state.currentHabit) return false;
                if (state.habitFormed) return false; // 既に習慣化済み

                const today = new Date();
                if (today.getDay() !== 0) return false; // 日曜日のみ

                // 今週既にテスト済みか確認
                const todayStr = getTodayString();
                const lastTest = state.rewardTestHistory[state.rewardTestHistory.length - 1];
                if (lastTest && lastTest.date === todayStr) return false;

                // ストリークが7日以上あれば報酬テストを提案
                return state.streak >= 7;
            },
        }),
        {
            name: 'habit-storage',
        }
    )
);
