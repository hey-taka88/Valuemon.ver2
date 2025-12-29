import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LifeArea } from '@/types';

// 今日の目標行動
export interface TodayGoal {
    id: string;
    goalText: string;           // 「朝10分瞑想する」など
    area: LifeArea;             // カテゴリ
    status: 'planned' | 'started' | 'completed' | 'skipped';
    createdAt: string;          // ISO日付
    completedAt?: string;
    obstacle?: string;          // うまくいかなかった理由
    ifThenPlan?: string;        // AI生成のIf-Thenプラン
}

// 通知設定
export interface NotificationSetting {
    enabled: boolean;
    time: string;               // "09:00" 形式
    type: 'reminder' | 'review';
}

interface ActionLogStore {
    // 状態
    todayGoal: TodayGoal | null;
    goalHistory: TodayGoal[];
    notifications: NotificationSetting[];

    // アクション
    setTodayGoal: (goalText: string, area: LifeArea) => void;
    startGoal: () => void;
    completeGoal: () => void;
    skipGoal: (reason?: string) => void;
    setObstacle: (obstacle: string, ifThenPlan?: string) => void;
    clearTodayGoal: () => void;
    addNotification: (setting: NotificationSetting) => void;
    removeNotification: (index: number) => void;

    // ヘルパー
    getTodayDateString: () => string;
    getWeeklyLogs: () => TodayGoal[];
    getStreak: () => number;
}

export const useActionLogStore = create<ActionLogStore>()(
    persist(
        (set, get) => ({
            todayGoal: null,
            goalHistory: [],
            notifications: [
                { enabled: true, time: '09:00', type: 'reminder' },
                { enabled: true, time: '21:00', type: 'review' },
            ],

            getTodayDateString: () => {
                return new Date().toISOString().split('T')[0];
            },

            setTodayGoal: (goalText, area) => {
                const today = get().getTodayDateString();

                // 既存の今日の目標があれば履歴に移動
                const currentGoal = get().todayGoal;
                if (currentGoal && currentGoal.createdAt.startsWith(today)) {
                    // 同じ日なら上書き
                } else if (currentGoal) {
                    set(state => ({
                        goalHistory: [...state.goalHistory, currentGoal].slice(-100),
                    }));
                }

                const newGoal: TodayGoal = {
                    id: crypto.randomUUID(),
                    goalText,
                    area,
                    status: 'planned',
                    createdAt: new Date().toISOString(),
                };

                set({ todayGoal: newGoal });
            },

            startGoal: () => {
                const { todayGoal } = get();
                if (!todayGoal) return;

                set({
                    todayGoal: {
                        ...todayGoal,
                        status: 'started',
                    },
                });
            },

            completeGoal: () => {
                const { todayGoal, goalHistory } = get();
                if (!todayGoal) return;

                const completedGoal: TodayGoal = {
                    ...todayGoal,
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                };

                set({
                    todayGoal: completedGoal,
                    goalHistory: [...goalHistory, completedGoal].slice(-100),
                });
            },

            skipGoal: (reason) => {
                const { todayGoal, goalHistory } = get();
                if (!todayGoal) return;

                const skippedGoal: TodayGoal = {
                    ...todayGoal,
                    status: 'skipped',
                    obstacle: reason,
                };

                set({
                    todayGoal: skippedGoal,
                    goalHistory: [...goalHistory, skippedGoal].slice(-100),
                });
            },

            setObstacle: (obstacle, ifThenPlan) => {
                const { todayGoal } = get();
                if (!todayGoal) return;

                set({
                    todayGoal: {
                        ...todayGoal,
                        obstacle,
                        ifThenPlan,
                    },
                });
            },

            clearTodayGoal: () => {
                set({ todayGoal: null });
            },

            addNotification: (setting) => {
                set(state => ({
                    notifications: [...state.notifications, setting],
                }));
            },

            removeNotification: (index) => {
                set(state => ({
                    notifications: state.notifications.filter((_, i) => i !== index),
                }));
            },

            getWeeklyLogs: () => {
                const { goalHistory, todayGoal } = get();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const logs = goalHistory.filter(log => {
                    const logDate = new Date(log.createdAt);
                    return logDate >= oneWeekAgo;
                });

                if (todayGoal) {
                    logs.push(todayGoal);
                }

                return logs;
            },

            getStreak: () => {
                const { goalHistory } = get();
                if (goalHistory.length === 0) return 0;

                let streak = 0;
                const sortedLogs = [...goalHistory]
                    .filter(log => log.status === 'completed')
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                if (sortedLogs.length === 0) return 0;

                // 連続日数をカウント
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                for (const log of sortedLogs) {
                    const logDate = new Date(log.createdAt);
                    logDate.setHours(0, 0, 0, 0);

                    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (diffDays === streak || diffDays === streak + 1) {
                        streak++;
                        currentDate = logDate;
                    } else {
                        break;
                    }
                }

                return streak;
            },
        }),
        {
            name: 'action-log-storage',
        }
    )
);
