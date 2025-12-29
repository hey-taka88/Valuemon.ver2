import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SPIRIT_STAGES, getStageByHabitCount, getProgressToNextStage, type SpiritStage } from '@/data/spiritData';

interface ValueSpiritStore {
    // 状態
    habitCount: number;         // 習慣達成回数
    lastEvolvedStage: number;   // 最後に進化演出を見せた段階
    lastEvolvedAt: string | null;

    // アクション
    incrementHabit: () => void;
    checkEvolution: () => boolean;
    acknowledgeEvolution: () => void;
    reset: () => void;

    // ヘルパー
    getCurrentStage: () => SpiritStage;
    getProgress: () => number;  // 次段階までの進捗 (0-100)
}

export const useValueSpiritStore = create<ValueSpiritStore>()(
    persist(
        (set, get) => ({
            habitCount: 0,
            lastEvolvedStage: 1,
            lastEvolvedAt: null,

            incrementHabit: () => {
                set(state => ({
                    habitCount: state.habitCount + 1,
                }));
            },

            checkEvolution: () => {
                const { habitCount, lastEvolvedStage } = get();
                const currentStage = getStageByHabitCount(habitCount);
                // 現在の段階が最後に演出を見せた段階より上なら進化演出が必要
                return currentStage.id > lastEvolvedStage;
            },

            acknowledgeEvolution: () => {
                const { habitCount } = get();
                const currentStage = getStageByHabitCount(habitCount);
                set({
                    lastEvolvedStage: currentStage.id,
                    lastEvolvedAt: new Date().toISOString(),
                });
            },

            reset: () => {
                set({
                    habitCount: 0,
                    lastEvolvedStage: 1,
                    lastEvolvedAt: null,
                });
            },

            getCurrentStage: () => {
                const { habitCount } = get();
                return getStageByHabitCount(habitCount);
            },

            getProgress: () => {
                const { habitCount } = get();
                return getProgressToNextStage(habitCount);
            },
        }),
        {
            name: 'value-spirit-storage',
        }
    )
);
