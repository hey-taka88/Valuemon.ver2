// 習慣別モンスターバリエーション
// 各習慣ごとに異なるテーマのモンスターを育成

export interface MonsterVariant {
    id: string;
    name: string;
    theme: string;          // テーマカラー/属性
    stages: MonsterStage[]; // 6段階の進化
}

export interface MonsterStage {
    level: number;
    name: string;
    emoji: string;
    description: string;
    minHabits: number;
}

// モンスターバリエーション（6種類）
export const MONSTER_VARIANTS: MonsterVariant[] = [
    {
        id: 'fire',
        name: '炎の精霊',
        theme: 'fire',
        stages: [
            { level: 1, name: '火花', emoji: '✨', description: '小さな火花', minHabits: 0 },
            { level: 2, name: '灯火', emoji: '🕯️', description: 'ほのかな光', minHabits: 10 },
            { level: 3, name: '炎', emoji: '🔥', description: '力強い炎', minHabits: 20 },
            { level: 4, name: '業火', emoji: '🏮', description: '導きの光', minHabits: 30 },
            { level: 5, name: '不死鳥', emoji: '🐦‍🔥', description: '再生の炎', minHabits: 40 },
            { level: 6, name: '炎龍', emoji: '🐉', description: '炎の守護者', minHabits: 50 },
        ],
    },
    {
        id: 'water',
        name: '水の精霊',
        theme: 'water',
        stages: [
            { level: 1, name: '雫', emoji: '💧', description: '一滴の雫', minHabits: 0 },
            { level: 2, name: '波紋', emoji: '🌊', description: '広がる波', minHabits: 10 },
            { level: 3, name: '渦', emoji: '🌀', description: '力の渦', minHabits: 20 },
            { level: 4, name: '滝', emoji: '💎', description: '流れる力', minHabits: 30 },
            { level: 5, name: '海神', emoji: '🐋', description: '深海の王', minHabits: 40 },
            { level: 6, name: '水龍', emoji: '🐲', description: '水の守護者', minHabits: 50 },
        ],
    },
    {
        id: 'earth',
        name: '大地の精霊',
        theme: 'earth',
        stages: [
            { level: 1, name: '種', emoji: '🌱', description: '生命の種', minHabits: 0 },
            { level: 2, name: '芽', emoji: '🌿', description: '成長の芽', minHabits: 10 },
            { level: 3, name: '樹', emoji: '🌳', description: '力強い樹', minHabits: 20 },
            { level: 4, name: '巨木', emoji: '🏔️', description: '揺るがぬ存在', minHabits: 30 },
            { level: 5, name: '森神', emoji: '🦌', description: '森の守護者', minHabits: 40 },
            { level: 6, name: '大地龍', emoji: '🐢', description: '大地の守護者', minHabits: 50 },
        ],
    },
    {
        id: 'wind',
        name: '風の精霊',
        theme: 'wind',
        stages: [
            { level: 1, name: 'そよ風', emoji: '🍃', description: '優しい風', minHabits: 0 },
            { level: 2, name: '旋風', emoji: '🌬️', description: '回る風', minHabits: 10 },
            { level: 3, name: '疾風', emoji: '💨', description: '速き風', minHabits: 20 },
            { level: 4, name: '暴風', emoji: '🌪️', description: '嵐の力', minHabits: 30 },
            { level: 5, name: '天鷲', emoji: '🦅', description: '空の王', minHabits: 40 },
            { level: 6, name: '風龍', emoji: '🪽', description: '風の守護者', minHabits: 50 },
        ],
    },
    {
        id: 'light',
        name: '光の精霊',
        theme: 'light',
        stages: [
            { level: 1, name: '星屑', emoji: '⭐', description: '小さな光', minHabits: 0 },
            { level: 2, name: '月光', emoji: '🌙', description: '夜の導き', minHabits: 10 },
            { level: 3, name: '太陽', emoji: '☀️', description: '輝く力', minHabits: 20 },
            { level: 4, name: '閃光', emoji: '✴️', description: '眩い光', minHabits: 30 },
            { level: 5, name: '守護天使', emoji: '👼', description: '光の使者', minHabits: 40 },
            { level: 6, name: '光龍', emoji: '🌟', description: '光の守護者', minHabits: 50 },
        ],
    },
    {
        id: 'shadow',
        name: '影の精霊',
        theme: 'shadow',
        stages: [
            { level: 1, name: '影', emoji: '🌑', description: '潜む影', minHabits: 0 },
            { level: 2, name: '闇', emoji: '🌚', description: '深まる闇', minHabits: 10 },
            { level: 3, name: '黒炎', emoji: '🖤', description: '黒き炎', minHabits: 20 },
            { level: 4, name: '深淵', emoji: '🕳️', description: '無限の深さ', minHabits: 30 },
            { level: 5, name: '闇精霊', emoji: '👻', description: '影の化身', minHabits: 40 },
            { level: 6, name: '闇龍', emoji: '🐍', description: '影の守護者', minHabits: 50 },
        ],
    },
];

// ランダムにモンスターバリエーションを選択
export function getRandomVariant(): MonsterVariant {
    const index = Math.floor(Math.random() * MONSTER_VARIANTS.length);
    return MONSTER_VARIANTS[index];
}

// IDからモンスターバリエーションを取得
export function getVariantById(id: string): MonsterVariant {
    return MONSTER_VARIANTS.find(v => v.id === id) || MONSTER_VARIANTS[0];
}

// 習慣回数から現在のステージを取得
export function getMonsterStage(variant: MonsterVariant, habitCount: number): MonsterStage {
    for (let i = variant.stages.length - 1; i >= 0; i--) {
        if (habitCount >= variant.stages[i].minHabits) {
            return variant.stages[i];
        }
    }
    return variant.stages[0];
}

// 次のステージまでの進捗を取得 (0-100)
export function getMonsterProgress(variant: MonsterVariant, habitCount: number): number {
    const currentStage = getMonsterStage(variant, habitCount);
    const currentIndex = variant.stages.findIndex(s => s.level === currentStage.level);

    if (currentIndex >= variant.stages.length - 1) {
        return 100;
    }

    const nextStage = variant.stages[currentIndex + 1];
    const habitsInStage = habitCount - currentStage.minHabits;
    const habitsNeeded = nextStage.minHabits - currentStage.minHabits;

    return Math.min(100, (habitsInStage / habitsNeeded) * 100);
}

// テーマに応じた色を取得
export function getThemeColors(theme: string): { primary: string; glow: string } {
    const colors: Record<string, { primary: string; glow: string }> = {
        fire: { primary: 'rgba(255,150,50,0.6)', glow: 'rgba(255,100,0,0.5)' },
        water: { primary: 'rgba(100,180,255,0.6)', glow: 'rgba(0,150,255,0.5)' },
        earth: { primary: 'rgba(150,200,100,0.6)', glow: 'rgba(100,180,50,0.5)' },
        wind: { primary: 'rgba(200,255,200,0.6)', glow: 'rgba(150,255,150,0.5)' },
        light: { primary: 'rgba(255,255,200,0.6)', glow: 'rgba(255,220,100,0.5)' },
        shadow: { primary: 'rgba(150,100,200,0.6)', glow: 'rgba(100,50,150,0.5)' },
    };
    return colors[theme] || colors.fire;
}
