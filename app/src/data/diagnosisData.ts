// Shadow Lantern 診断データ
// モバイルアプリからの移植

// ========== 価値観ID型 ==========
export type ValueId =
    | 'wealth' | 'financial_security' | 'achievement' | 'recognition'
    | 'beauty' | 'attractiveness' | 'love' | 'intimacy' | 'belonging'
    | 'influence' | 'competence' | 'creativity' | 'freedom' | 'autonomy'
    | 'stability' | 'security' | 'inner_peace' | 'resilience'
    | 'responsibility' | 'trust' | 'honesty' | 'integrity' | 'respect'
    | 'dignity' | 'justice' | 'fairness' | 'loyalty' | 'order'
    | 'compassion' | 'growth' | 'purpose' | 'meaning' | 'contribution';

// ========== 嫉妬分析 ==========
export interface EnvyQuestion {
    id: string;
    question: string;
    type: 'text' | 'scale' | 'choice';
    options?: { id: string; label: string; values: ValueId[] }[];
}

export const ENVY_QUESTIONS: EnvyQuestion[] = [
    {
        id: 'envy_target',
        question: '最近「見た瞬間にイラッとする」人を思い浮かべてください。その人のどんな部分にモヤっとしますか？',
        type: 'text',
    },
    {
        id: 'envy_factor_income',
        question: 'その人の「収入・お金」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_success',
        question: 'その人の「仕事の成功・評価」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_appearance',
        question: 'その人の「見た目・スタイル」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_relationship',
        question: 'その人の「恋愛・結婚」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_social',
        question: 'その人の「コミュ力・人気」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_talent',
        question: 'その人の「才能・センス」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_factor_freedom',
        question: 'その人の「自由さ・時間」についてどれくらい気になりますか？',
        type: 'scale',
    },
    {
        id: 'envy_swap',
        question: 'その人と完全に入れ替われるとしたら、どの部分だけ欲しいですか？',
        type: 'choice',
        options: [
            { id: 'A', label: '生活水準', values: ['wealth', 'financial_security'] },
            { id: 'B', label: '能力', values: ['growth', 'achievement', 'competence'] },
            { id: 'C', label: '人間関係', values: ['love', 'belonging', 'influence'] },
            { id: 'D', label: 'ライフスタイル', values: ['freedom', 'autonomy'] },
            { id: 'E', label: '外見', values: ['beauty', 'attractiveness', 'recognition'] },
        ],
    },
];

export const ENVY_FACTOR_VALUES: Record<string, ValueId[]> = {
    income: ['wealth', 'financial_security'],
    success: ['achievement', 'recognition'],
    appearance: ['beauty', 'attractiveness'],
    relationship: ['love', 'intimacy'],
    social: ['belonging', 'influence'],
    talent: ['competence', 'creativity'],
    freedom: ['freedom', 'autonomy'],
};

// ========== 怒り分析 ==========
export interface RageQuestion {
    id: string;
    question: string;
    type: 'text' | 'choice' | 'multi';
    options?: { id: string; label: string; values: ValueId[] }[];
}

export const RAGE_QUESTIONS: RageQuestion[] = [
    {
        id: 'rage_episode',
        question: 'ここ3年で「本気で縁を切ろうと思った」出来事を思い出してください。何があったか教えてください。',
        type: 'text',
    },
    {
        id: 'rage_action_type',
        question: 'その人は何をしましたか？',
        type: 'choice',
        options: [
            { id: 'promise_break', label: '約束を破った', values: ['responsibility', 'trust'] },
            { id: 'lie', label: '嘘をついた', values: ['honesty', 'integrity'] },
            { id: 'disrespect', label: 'バカにした・見下した', values: ['respect', 'dignity'] },
            { id: 'ignore', label: '無視した・軽んじた', values: ['recognition', 'belonging'] },
            { id: 'exploit', label: '利用した・搾取した', values: ['justice', 'fairness'] },
            { id: 'betray', label: '裏切った', values: ['loyalty', 'trust'] },
            { id: 'rulebreak', label: 'ルールを破った', values: ['order', 'responsibility'] },
            { id: 'bully', label: '弱者いじめ', values: ['justice', 'compassion'] },
        ],
    },
    {
        id: 'rage_emotion',
        question: 'そのとき感じた怒りはどれに近いですか？',
        type: 'choice',
        options: [
            { id: 'insult', label: '侮辱の怒り', values: ['respect', 'dignity'] },
            { id: 'unfair', label: '不公平への怒り', values: ['justice', 'fairness'] },
            { id: 'betrayal', label: '裏切りへの怒り', values: ['loyalty', 'trust'] },
            { id: 'irresponsible', label: '無責任への怒り', values: ['responsibility', 'integrity'] },
            { id: 'bully', label: '弱者いじめへの怒り', values: ['justice', 'compassion'] },
            { id: 'time', label: '時間軽視への怒り', values: ['autonomy', 'respect'] },
        ],
    },
];

// ========== 喪失分析 ==========
export interface LossQuestion {
    id: string;
    question: string;
    type: 'scale' | 'choice' | 'text';
    resource?: string;
    options?: { id: string; label: string; values: ValueId[] }[];
}

export const LOSS_RESOURCES = [
    { id: 'money', label: 'お金' },
    { id: 'career', label: 'キャリア' },
    { id: 'family', label: '家族' },
    { id: 'partner', label: 'パートナー' },
    { id: 'friends', label: '友人' },
    { id: 'health', label: '健康' },
    { id: 'hobby', label: '趣味' },
    { id: 'time', label: '時間' },
    { id: 'status', label: '地位' },
    { id: 'home', label: '住まい' },
];

export const LOSS_QUESTIONS: LossQuestion[] = [
    {
        id: 'loss_pain',
        question: 'この要素を失ったと想像すると、苦痛はどれくらいですか？',
        type: 'scale',
    },
    {
        id: 'loss_emotion',
        question: '失ったとき最初に浮かぶ感情は？',
        type: 'choice',
        options: [
            { id: 'powerlessness', label: '無力感', values: ['competence', 'autonomy'] },
            { id: 'shame', label: '恥', values: ['dignity', 'recognition'] },
            { id: 'fear', label: '恐怖', values: ['security', 'stability'] },
            { id: 'loneliness', label: '孤独', values: ['belonging', 'love'] },
            { id: 'rage', label: '怒り', values: ['justice', 'fairness'] },
            { id: 'emptiness', label: '虚無感', values: ['purpose', 'meaning'] },
        ],
    },
    {
        id: 'loss_identity',
        question: 'これを失う想像をしたとき「自分が自分でなくなる」と感じるものはどれですか？',
        type: 'choice',
    },
    {
        id: 'loss_fear',
        question: 'その要素が完全に失われた世界で一番怖いのは？',
        type: 'choice',
        options: [
            { id: 'no_respect', label: '誰からも尊重されない', values: ['respect', 'dignity'] },
            { id: 'poverty', label: '経済的に生きていけない', values: ['security', 'wealth'] },
            { id: 'unloved', label: '愛されない・必要とされない', values: ['love', 'belonging'] },
            { id: 'useless', label: '何の役にも立たない', values: ['contribution', 'purpose'] },
            { id: 'meaningless', label: '生きる意味を感じられない', values: ['purpose', 'meaning'] },
            { id: 'wasted', label: '努力が全部無駄だった', values: ['achievement', 'growth'] },
        ],
    },
];

// ========== ランタン質問（4セクション） ==========
export interface LanternQuestion {
    id: string;
    section: 'flame' | 'protection' | 'handle' | 'light';
    question: string;
    type: 'text' | 'multi-text';
    placeholder?: string;
}

export const LANTERN_SECTION_INFO = {
    flame: { name: '炎', emoji: '🔥', description: '価値観の核心' },
    protection: { name: '保護', emoji: '🛡️', description: '価値観を守る習慣' },
    handle: { name: '持ち手', emoji: '🤲', description: '危険信号の認識' },
    light: { name: '光', emoji: '✨', description: '周囲への影響' },
};

export const LANTERN_QUESTIONS: LanternQuestion[] = [
    // Flame
    {
        id: 'flame_definition',
        section: 'flame',
        question: 'あなたにとって最も大切な価値観とは何ですか？自分の言葉で定義してください。',
        type: 'text',
        placeholder: '例：自由とは、自分の時間を自分で決められること',
    },
    {
        id: 'flame_ideal_day',
        section: 'flame',
        question: 'その価値観が完全に実現した1日を想像してください。どんな1日ですか？',
        type: 'text',
        placeholder: '朝起きてから夜寝るまでを具体的に...',
    },
    // Protection
    {
        id: 'protection_habits',
        section: 'protection',
        question: 'その価値観を守るために続けている習慣は何ですか？',
        type: 'multi-text',
        placeholder: '例：毎朝30分の読書時間',
    },
    {
        id: 'protection_boundaries',
        section: 'protection',
        question: 'その価値観を守るために「No」と言うべきことは何ですか？',
        type: 'multi-text',
        placeholder: '例：急な残業依頼',
    },
    // Handle
    {
        id: 'handle_body_signs',
        section: 'handle',
        question: '価値観が脅かされているとき、体にどんなサインが出ますか？',
        type: 'multi-text',
        placeholder: '例：肩こり、頭痛、不眠',
    },
    {
        id: 'handle_mind_signs',
        section: 'handle',
        question: '価値観が脅かされているとき、心にどんなサインが出ますか？',
        type: 'multi-text',
        placeholder: '例：イライラ、無気力、焦り',
    },
    {
        id: 'handle_self_message',
        section: 'handle',
        question: 'サインが続いたとき、自分に言ってあげたい言葉は？',
        type: 'text',
        placeholder: '例：今は休む時だよ',
    },
    // Light
    {
        id: 'light_ideal_state',
        section: 'light',
        question: '価値観の炎が燃えているとき、あなたはどんな状態ですか？',
        type: 'text',
        placeholder: '例：エネルギーに満ちて、何でもできる気がする',
    },
    {
        id: 'light_impact',
        section: 'light',
        question: 'その光は周りの人にどんな影響を与えますか？',
        type: 'text',
        placeholder: '例：周りの人も元気になる',
    },
];

// ========== 診断モジュール選択 ==========
export const DIAGNOSIS_MODULES = [
    {
        id: 'shadow',
        name: 'シャドウ・プロファイリング',
        description: '感情からガチで掘る',
        emoji: '🌑',
        duration: '約10分',
    },
    {
        id: 'lantern',
        name: 'バリューランタン',
        description: '今の価値観を整理',
        emoji: '🏮',
        duration: '約8分',
    },
    {
        id: 'sentence',
        name: 'アンフィニッシュド・センテンス',
        description: '文章で内省',
        emoji: '✍️',
        duration: '約5分',
    },
    {
        id: 'mix',
        name: '全部ミックス',
        description: 'おすすめ・総合診断',
        emoji: '🔮',
        duration: '約15分',
    },
];
