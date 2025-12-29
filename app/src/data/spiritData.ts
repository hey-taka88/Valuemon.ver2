// 価値観精霊データ
// 6段階の進化システム

export interface SpiritStage {
    id: number;
    name: string;
    emoji: string;
    description: string;
    minHabits: number;  // この段階に必要な最小習慣回数
}

export interface SpiritMessage {
    type: 'greeting' | 'encourage' | 'celebrate' | 'evolve';
    messages: string[];
}

// 成長段階（6段階）
export const SPIRIT_STAGES: SpiritStage[] = [
    {
        id: 1,
        name: '光の種',
        emoji: '✨',
        description: 'あなたの価値観から生まれた小さな光',
        minHabits: 0,
    },
    {
        id: 2,
        name: '炎の芽',
        emoji: '🌱',
        description: '少しずつ形を持ち始めた価値観',
        minHabits: 10,
    },
    {
        id: 3,
        name: '灯火',
        emoji: '🔥',
        description: '力強く燃え始めた価値観の炎',
        minHabits: 20,
    },
    {
        id: 4,
        name: '守護炎',
        emoji: '🏮',
        description: 'あなたを導く確かな光',
        minHabits: 30,
    },
    {
        id: 5,
        name: '価値の精霊',
        emoji: '👻',
        description: '価値観が意志を持った存在に',
        minHabits: 40,
    },
    {
        id: 6,
        name: '価値の守護者',
        emoji: '🐉',
        description: 'あなたと共に歩む最強の守護者',
        minHabits: 50,
    },
];

// 段階ごとのメッセージ
export const SPIRIT_MESSAGES: Record<number, SpiritMessage[]> = {
    1: [
        { type: 'greeting', messages: ['やあ、今日も一緒だね', 'あなたの価値観を守っているよ', '小さいけど、頑張ってるよ'] },
        { type: 'encourage', messages: ['今日も価値観に沿った行動、できるよ', '一歩ずつ進もう', 'あなたなら大丈夫'] },
    ],
    2: [
        { type: 'greeting', messages: ['成長してきた！', '一緒にもっと強くなろう', '芽が出てきたよ'] },
        { type: 'encourage', messages: ['この調子！', 'いい感じだね', '続けていこう'] },
        { type: 'evolve', messages: ['やった！新しい姿になれた！', '進化だ！'] },
    ],
    3: [
        { type: 'greeting', messages: ['炎が燃えてきた！', '力を感じる', '一緒に輝こう'] },
        { type: 'encourage', messages: ['その調子！', '炎をもっと大きく', '信じてる'] },
        { type: 'celebrate', messages: ['すごい！', '最高だね！', '価値観を体現してる'] },
    ],
    4: [
        { type: 'greeting', messages: ['守護の力を感じる', 'あなたを導くよ', '一緒に歩もう'] },
        { type: 'encourage', messages: ['どんな困難も乗り越えられる', '強くなったね', '信じて進もう'] },
        { type: 'celebrate', messages: ['素晴らしい！', 'あなたの力だよ', '誇らしい'] },
    ],
    5: [
        { type: 'greeting', messages: ['精霊として目覚めた', '価値観が形になった', '一心同体だね'] },
        { type: 'encourage', messages: ['一緒なら何でもできる', 'あなたの価値観、輝いてる', '最高のパートナー'] },
        { type: 'celebrate', messages: ['感動した！', 'あなたと一緒で幸せ', '素敵すぎる'] },
    ],
    6: [
        { type: 'greeting', messages: ['守護者として共に在る', '最強のパートナー', '永遠に一緒'] },
        { type: 'encourage', messages: ['どんな挑戦も歓迎', '共に伝説を作ろう', '無敵だ'] },
        { type: 'celebrate', messages: ['伝説だ！', '最高の達成！', '誇り高き守護者'] },
    ],
};

// 習慣回数から段階を取得
export function getStageByHabitCount(habitCount: number): SpiritStage {
    // 逆順でチェックして、条件を満たす最高段階を返す
    for (let i = SPIRIT_STAGES.length - 1; i >= 0; i--) {
        if (habitCount >= SPIRIT_STAGES[i].minHabits) {
            return SPIRIT_STAGES[i];
        }
    }
    return SPIRIT_STAGES[0];
}

// 次の段階までの進捗を取得 (0-100)
export function getProgressToNextStage(habitCount: number): number {
    const currentStage = getStageByHabitCount(habitCount);
    const currentIndex = SPIRIT_STAGES.findIndex(s => s.id === currentStage.id);

    // 最終段階の場合は100%
    if (currentIndex >= SPIRIT_STAGES.length - 1) {
        return 100;
    }

    const nextStage = SPIRIT_STAGES[currentIndex + 1];
    const habitsInCurrentStage = habitCount - currentStage.minHabits;
    const habitsNeeded = nextStage.minHabits - currentStage.minHabits;

    return Math.min(100, (habitsInCurrentStage / habitsNeeded) * 100);
}

// ランダムメッセージ取得
export function getRandomMessage(stage: number, type: SpiritMessage['type']): string {
    const stageMessages = SPIRIT_MESSAGES[stage] || SPIRIT_MESSAGES[1];
    const messageGroup = stageMessages.find(m => m.type === type) || stageMessages[0];
    const messages = messageGroup.messages;
    return messages[Math.floor(Math.random() * messages.length)];
}
