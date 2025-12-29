import type { LifeArea } from '@/types';

// 人生領域定義
export const LIFE_AREAS: Record<LifeArea, {
    name: string;
    emoji: string;
    description: string;
}> = {
    work: {
        name: '仕事・学び',
        emoji: '💼',
        description: 'キャリア、学習、スキルアップ'
    },
    play: {
        name: '遊び・趣味',
        emoji: '🎮',
        description: '楽しみ、リフレッシュ、創造'
    },
    relationship: {
        name: '人間関係',
        emoji: '💖',
        description: '家族、友人、パートナー、コミュニティ'
    },
    growth: {
        name: '自己成長・健康',
        emoji: '🌱',
        description: '運動、瞑想、読書、内省'
    },
    money: {
        name: 'お金・住環境',
        emoji: '💰',
        description: '収入、支出、貯蓄、整理整頓'
    },
    spiritual: {
        name: '内面・意味',
        emoji: '✨',
        description: '価値観、信念、人生の目的'
    }
};

// 価値観に沿った行動例（各ライフエリアごと）
export const VALUE_ALIGNED_ACTIONS: Record<LifeArea, string[]> = {
    work: [
        '価値観に合うプロジェクトに時間を使う',
        '意味を感じる仕事に集中する',
        'スキルアップに投資する',
    ],
    play: [
        '本当に楽しいと思える趣味に時間を使う',
        '心から笑える時間を作る',
        '創造的な活動をする',
    ],
    relationship: [
        '大切な人との時間を優先する',
        '感謝を伝える',
        '助けを求める・助けを提供する',
    ],
    growth: [
        '体を動かす',
        '瞑想・マインドフルネス',
        '新しいことを学ぶ',
    ],
    money: [
        '価値観に沿った支出をする',
        '不要なものを手放す',
        '将来のために貯蓄する',
    ],
    spiritual: [
        '自分の価値観を振り返る',
        '感謝日記をつける',
        '静かな時間を持つ',
    ],
};
