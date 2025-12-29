// 価値観の型定義
export interface Value {
    id: string;
    name_ja: string;
    name_en: string;
    category: ValueCategory;
    description: string;
    shadow_trigger: string;
    keywords: string[];
}

export type ValueCategory =
    | 'achievement'
    | 'relationship'
    | 'autonomy'
    | 'security'
    | 'pleasure'
    | 'meaning'
    | 'power'
    | 'tradition';

// シャドウログの型定義
export interface ShadowLog {
    id: string;
    userId: string;
    emotionType: EmotionType;
    targetDescription: string;
    intensity: number;
    analyzedValueIds: string[];
    factorScores: Record<string, number>;
    detectedDiscrepancies: Discrepancy[];
    createdAt: Date;
}

export type EmotionType = 'envy' | 'rage' | 'loss';

export interface Discrepancy {
    type: 'value_conflict' | 'self_image' | 'cross_module';
    consciousValue: string;
    shadowValue: string;
    description: string;
}

// バリューランタンの型定義
export interface ValueLantern {
    id: string;
    userId: string;
    flame: {
        primaryValue: string;
        secondaryValue?: string;
        personalDefinition: string;
        idealDay: string;
    };
    protection: {
        habits: string[];
        relationships: string[];
        boundaries: string[];
        supporters: string[];
    };
    handle: {
        bodySigns: string[];
        mindSigns: string[];
        behaviorSigns: string[];
        selfMessage: string;
    };
    light: {
        idealState: string;
        impactOnOthers: string;
        impactOnSociety: string;
    };
    version: number;
    updatedAt: Date;
}

// アクションログの型定義
export interface ActionLog {
    id: string;
    userId: string;
    actionType: string;
    lifeArea: LifeArea;
    description?: string;
    valueAligned: boolean;  // 価値観に沿った行動だったか
    loggedAt: Date;
}

export type LifeArea = 'work' | 'play' | 'relationship' | 'growth' | 'money' | 'spiritual';

// 診断フェーズの状態
export interface DiagnosisState {
    currentPhase: EmotionType | 'complete';
    envyResponses: EnvyResponse[];
    rageResponses: RageResponse[];
    lossResponses: LossResponse[];
    detectedValues: DetectedValue[];
    discrepancies: Discrepancy[];
}

export interface EnvyResponse {
    target: string;
    factorScores: Record<string, number>;
    desiredPart: string;
}

export interface RageResponse {
    episode: string;
    actionType: string;
    emotionLabel: string;
    relation: string;
}

export interface LossResponse {
    resource: string;
    painLevel: number;
    primaryEmotion: string;
    reason: string;
}

export interface DetectedValue {
    valueId: string;
    source: EmotionType;
    confidence: number;
    evidence: string;
}

// チャットメッセージの型定義
export interface ChatMessage {
    id: string;
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
    options?: ChatOption[];
}

export interface ChatOption {
    id: string;
    label: string;
    valueIds?: string[];
}

// 習慣記録の型定義
export interface HabitRecord {
    id: string;
    userId: string;
    habitName: string;
    reward: string;
    streak: number;
    rewardTestPassed: boolean;
    lastCompleted: Date;
}
