// アンフィニッシュド・センテンス診断データ
// 文章穴埋め形式で無意識の価値観を抽出

export interface SentenceCategory {
    id: string;
    name: string;
    emoji: string;
    color: string;
    questions: SentenceQuestion[];
}

export interface SentenceQuestion {
    id: string;
    prefix: string;  // 文章の前半（空欄の前）
    suffix: string;  // 文章の後半（空欄の後）
    placeholder: string;  // 入力欄のプレースホルダー
}

export const SENTENCE_CATEGORIES: SentenceCategory[] = [
    {
        id: 'money',
        name: 'お金',
        emoji: '💰',
        color: '#f39c12',
        questions: [
            {
                id: 'money_1',
                prefix: 'お金について、家族は私に',
                suffix: 'であれと教えてくれた。',
                placeholder: '例: 堅実、自由、慎重...',
            },
            {
                id: 'money_2',
                prefix: 'お金について、一番怖いのは',
                suffix: 'だ。',
                placeholder: '例: 借金、貧困、依存...',
            },
            {
                id: 'money_3',
                prefix: '地面に1万円が落ちていたら、私は',
                suffix: 'だろう。',
                placeholder: '例: 届ける、拾う、無視する...',
            },
        ],
    },
    {
        id: 'work',
        name: '仕事',
        emoji: '💼',
        color: '#3498db',
        questions: [
            {
                id: 'work_1',
                prefix: '仕事について、私が一番誇りに思うのは',
                suffix: 'だ。',
                placeholder: '例: 成果、成長、貢献...',
            },
            {
                id: 'work_2',
                prefix: '「こういう働き方だけは嫌だ」と思うのは',
                suffix: 'な働き方だ。',
                placeholder: '例: 無意味、不誠実、孤独...',
            },
            {
                id: 'work_3',
                prefix: '努力が報われないとき、私は',
                suffix: 'と感じる。',
                placeholder: '例: 悔しい、虚しい、不公平...',
            },
        ],
    },
    {
        id: 'relationship',
        name: '人間関係',
        emoji: '💕',
        color: '#e91e63',
        questions: [
            {
                id: 'relationship_1',
                prefix: '家族との関係で、私が絶対に守りたいのは',
                suffix: 'だ。',
                placeholder: '例: 信頼、絆、自由...',
            },
            {
                id: 'relationship_2',
                prefix: '恋愛で「これをされたら終わり」と思うのは',
                suffix: 'だ。',
                placeholder: '例: 浮気、嘘、無関心...',
            },
            {
                id: 'relationship_3',
                prefix: '友人に対して、私が一番大事にしているのは',
                suffix: 'だ。',
                placeholder: '例: 誠実さ、楽しさ、支え合い...',
            },
        ],
    },
    {
        id: 'health',
        name: '健康',
        emoji: '🌿',
        color: '#2ecc71',
        questions: [
            {
                id: 'health_1',
                prefix: '健康について、私が一番譲れないのは',
                suffix: 'だ。',
                placeholder: '例: 睡眠、運動、食事...',
            },
            {
                id: 'health_2',
                prefix: 'メンタルが限界に近づくと、私は',
                suffix: 'という行動を取りがちだ。',
                placeholder: '例: 引きこもる、暴飲暴食、愚痴る...',
            },
        ],
    },
    {
        id: 'life',
        name: '人生',
        emoji: '✨',
        color: '#9b59b6',
        questions: [
            {
                id: 'life_1',
                prefix: '人生で「これだけは諦めたくない」と思うのは',
                suffix: 'だ。',
                placeholder: '例: 夢、家族、自分らしさ...',
            },
            {
                id: 'life_2',
                prefix: '大人になってから「自分は本当は',
                suffix: 'を大事にしていた」と気づいた。',
                placeholder: '例: 自由、安定、創造性...',
            },
        ],
    },
];

// 全質問数を計算
export const TOTAL_QUESTIONS = SENTENCE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
);

// カテゴリIDから情報を取得
export function getCategoryById(id: string): SentenceCategory | undefined {
    return SENTENCE_CATEGORIES.find(cat => cat.id === id);
}
