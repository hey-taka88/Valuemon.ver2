import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    DiagnosisState,
    EmotionType,
    EnvyResponse,
    RageResponse,
    LossResponse,
    DetectedValue,
    Discrepancy,
    ChatMessage
} from '@/types';

interface DiagnosisStore {
    // 状態
    state: DiagnosisState;
    messages: ChatMessage[];
    isLoading: boolean;

    // アクション
    setPhase: (phase: EmotionType | 'complete') => void;
    addEnvyResponse: (response: EnvyResponse) => void;
    addRageResponse: (response: RageResponse) => void;
    addLossResponse: (response: LossResponse) => void;
    addDetectedValue: (value: DetectedValue) => void;
    addDiscrepancy: (discrepancy: Discrepancy) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

const initialState: DiagnosisState = {
    currentPhase: 'envy',
    envyResponses: [],
    rageResponses: [],
    lossResponses: [],
    detectedValues: [],
    discrepancies: [],
};

export const useDiagnosisStore = create<DiagnosisStore>()(
    persist(
        (set) => ({
            state: initialState,
            messages: [],
            isLoading: false,

            setPhase: (phase) =>
                set((store) => ({
                    state: { ...store.state, currentPhase: phase }
                })),

            addEnvyResponse: (response) =>
                set((store) => ({
                    state: {
                        ...store.state,
                        envyResponses: [...store.state.envyResponses, response]
                    }
                })),

            addRageResponse: (response) =>
                set((store) => ({
                    state: {
                        ...store.state,
                        rageResponses: [...store.state.rageResponses, response]
                    }
                })),

            addLossResponse: (response) =>
                set((store) => ({
                    state: {
                        ...store.state,
                        lossResponses: [...store.state.lossResponses, response]
                    }
                })),

            addDetectedValue: (value) =>
                set((store) => ({
                    state: {
                        ...store.state,
                        detectedValues: [...store.state.detectedValues, value]
                    }
                })),

            addDiscrepancy: (discrepancy) =>
                set((store) => ({
                    state: {
                        ...store.state,
                        discrepancies: [...store.state.discrepancies, discrepancy]
                    }
                })),

            addMessage: (message) =>
                set((store) => ({
                    messages: [
                        ...store.messages,
                        {
                            ...message,
                            id: crypto.randomUUID(),
                            timestamp: new Date(),
                        }
                    ]
                })),

            setLoading: (loading) => set({ isLoading: loading }),

            reset: () => set({ state: initialState, messages: [] }),
        }),
        {
            name: 'diagnosis-storage',
        }
    )
);
