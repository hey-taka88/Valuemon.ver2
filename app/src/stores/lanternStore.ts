import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ValueLantern } from '@/types';

interface LanternStore {
    lantern: ValueLantern | null;
    currentStep: 'flame' | 'protection' | 'handle' | 'light' | 'complete';

    // Draft values during creation
    draft: Partial<ValueLantern>;

    // Actions
    setStep: (step: LanternStore['currentStep']) => void;
    updateFlame: (flame: ValueLantern['flame']) => void;
    updateProtection: (protection: ValueLantern['protection']) => void;
    updateHandle: (handle: ValueLantern['handle']) => void;
    updateLight: (light: ValueLantern['light']) => void;
    saveLantern: () => void;
    reset: () => void;
}

export const useLanternStore = create<LanternStore>()(
    persist(
        (set, get) => ({
            lantern: null,
            currentStep: 'flame',
            draft: {},

            setStep: (step) => set({ currentStep: step }),

            updateFlame: (flame) => set((state) => ({
                draft: { ...state.draft, flame }
            })),

            updateProtection: (protection) => set((state) => ({
                draft: { ...state.draft, protection }
            })),

            updateHandle: (handle) => set((state) => ({
                draft: { ...state.draft, handle }
            })),

            updateLight: (light) => set((state) => ({
                draft: { ...state.draft, light }
            })),

            saveLantern: () => {
                const { draft } = get();
                const lantern: ValueLantern = {
                    id: crypto.randomUUID(),
                    userId: 'local-user',
                    flame: draft.flame!,
                    protection: draft.protection || { habits: [], relationships: [], boundaries: [], supporters: [] },
                    handle: draft.handle || { bodySigns: [], mindSigns: [], behaviorSigns: [], selfMessage: '' },
                    light: draft.light || { idealState: '', impactOnOthers: '', impactOnSociety: '' },
                    version: 1,
                    updatedAt: new Date(),
                };
                set({ lantern, currentStep: 'complete', draft: {} });
            },

            reset: () => set({
                lantern: null,
                currentStep: 'flame',
                draft: {}
            }),
        }),
        {
            name: 'lantern-storage',
        }
    )
);
