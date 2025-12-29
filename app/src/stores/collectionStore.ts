import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 育成完了したモンスターの記録
export interface CollectedMonster {
    id: string;                 // ユニークID
    variantId: string;          // モンスター種類（fire, water等）
    habitName: string;          // 習慣名
    finalLevel: number;         // 最終到達レベル
    totalHabits: number;        // 総習慣達成回数
    startDate: string;          // 育成開始日
    endDate: string;            // 育成完了日
    longestStreak: number;      // 最長ストリーク
}

interface CollectionState {
    monsters: CollectedMonster[];
    totalHabitsEver: number;    // 累計習慣達成数（全モンスター合計）
}

interface CollectionActions {
    // モンスターをコレクションに追加
    addMonster: (monster: Omit<CollectedMonster, 'id' | 'endDate'>) => void;

    // 統計取得
    getStats: () => {
        totalMonsters: number;
        maxLevelMonsters: number;
        totalHabits: number;
        bestStreak: number;
    };

    // コレクションクリア（デバッグ用）
    clearCollection: () => void;
}

type CollectionStore = CollectionState & CollectionActions;

export const useCollectionStore = create<CollectionStore>()(
    persist(
        (set, get) => ({
            monsters: [],
            totalHabitsEver: 0,

            addMonster: (monster) => {
                const newMonster: CollectedMonster = {
                    ...monster,
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    endDate: new Date().toISOString(),
                };

                set(state => ({
                    monsters: [...state.monsters, newMonster],
                    totalHabitsEver: state.totalHabitsEver + monster.totalHabits,
                }));
            },

            getStats: () => {
                const { monsters } = get();
                return {
                    totalMonsters: monsters.length,
                    maxLevelMonsters: monsters.filter(m => m.finalLevel >= 6).length,
                    totalHabits: monsters.reduce((sum, m) => sum + m.totalHabits, 0),
                    bestStreak: Math.max(0, ...monsters.map(m => m.longestStreak)),
                };
            },

            clearCollection: () => {
                set({ monsters: [], totalHabitsEver: 0 });
            },
        }),
        {
            name: 'collection-storage',
        }
    )
);
