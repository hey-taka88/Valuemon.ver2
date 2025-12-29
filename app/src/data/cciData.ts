// ========================================
// CCI（キャリア構築インタビュー）データ
// Savickas のキャリア構築理論に基づく6つの質問
// ========================================

export interface CCIQuestion {
    id: string;
    title: string;
    question: string;
    description: string;
    placeholder: string;
    minResponses?: number;  // 複数回答が必要な場合
    maxResponses?: number;
}

export interface CCIResponse {
    questionId: string;
    responses: string[];
}

export interface CCIAnalysisResult {
    themes: {
        id: string;
        name: string;
        description: string;
        frequency: number;  // 出現頻度
    }[];
    lifeNarrative: string;     // 人生のストーリー
    coreValues: string[];       // 導き出された価値観
    careerAdvice: string;       // キャリアへのアドバイス
}

// 6つのCCI質問
export const CCI_QUESTIONS: CCIQuestion[] = [
    {
        id: 'role_models',
        title: '🌟 ロールモデル',
        question: 'あなたが尊敬する、または憧れた人物は誰ですか？',
        description: '実在の人物、架空のキャラクター、歴史上の人物など3名挙げてください。それぞれ、なぜその人を尊敬するのかも教えてください。',
        placeholder: '例: 宮崎駿 - 独自の世界観と妥協しない姿勢',
        minResponses: 1,
        maxResponses: 3,
    },
    {
        id: 'favorite_media',
        title: '📺 好きなメディア',
        question: '定期的に見る/読むメディアは何ですか？',
        description: '雑誌、TV番組、YouTube、Podcast、Webサイトなど。なぜそれに惹かれるのかも含めて教えてください。',
        placeholder: '例: TED Talks - 新しい視点やアイデアに触れられるから',
        minResponses: 1,
        maxResponses: 3,
    },
    {
        id: 'favorite_story',
        title: '📚 心に残る物語',
        question: '特に心に残っている本、映画、ドラマは？',
        description: 'ストーリーの概要と、なぜそれが心に残っているのか教えてください。',
        placeholder: '例: 「ショーシャンクの空に」- 希望を捨てずに自由を勝ち取る姿に感動',
        minResponses: 1,
        maxResponses: 2,
    },
    {
        id: 'motto',
        title: '💬 座右の銘',
        question: 'あなたの座右の銘、または好きな言葉は？',
        description: 'その言葉があなたにとってなぜ大切なのか、どんな時に思い出すかも教えてください。',
        placeholder: '例: 「継続は力なり」- 挫けそうな時に自分を励ましてくれる',
        minResponses: 1,
        maxResponses: 2,
    },
    {
        id: 'early_recollections',
        title: '👶 幼少期の記憶',
        question: '幼少期（3〜8歳頃）の鮮明な記憶を3つ教えてください',
        description: '良い記憶でも悪い記憶でも構いません。その時の感情、状況、誰がいたかなど、できるだけ詳しく思い出してください。',
        placeholder: '例: 5歳の時、初めて自転車に乗れた。父が後ろで支えてくれていて、振り返ったらいなかった。驚きと達成感。',
        minResponses: 1,
        maxResponses: 3,
    },
    {
        id: 'subjects_leisure',
        title: '🎨 好きだった科目・趣味',
        question: '学生時代に好きだった科目、または今夢中になっている趣味は？',
        description: 'なぜその科目/趣味が好きなのか、どんな時間が一番楽しいかも教えてください。',
        placeholder: '例: 美術 - 何もないところから形を作り出す創造の喜び',
        minResponses: 1,
        maxResponses: 3,
    },
];

// CCI分析用のプロンプトテンプレート
export const CCI_ANALYSIS_PROMPT = `
あなたはキャリアカウンセラーであり、Savickasのキャリア構築理論に精通しています。

ユーザーの回答から以下を分析してください：

1. **繰り返し現れるテーマ**: 回答全体を通じて繰り返し現れるパターン、価値観、欲求を特定
2. **人生のナラティブ**: 回答から見える「人生のストーリー」を1-2文で要約
3. **コア価値観**: 最も重要と思われる価値観を3-5個抽出
4. **キャリアへのアドバイス**: この人が満足できる仕事・活動の特徴を提案

【分析のヒント】
- ロールモデルには「なりたい自分」が投影されている
- 好きなメディア・物語には「解決したい問題」が隠れている
- 座右の銘は「人生で大切にしていること」を表す
- 幼少期の記憶には「人生の原型テーマ」がある
- 好きな科目・趣味は「本来の自分」を反映している
`;

// テーマカテゴリ
export const THEME_CATEGORIES = [
    { id: 'autonomy', name: '自律・自由', keywords: ['自由', '独立', '自分らしさ', 'コントロール'] },
    { id: 'achievement', name: '達成・成功', keywords: ['成功', '目標', '勝利', 'チャレンジ'] },
    { id: 'connection', name: '繋がり・関係', keywords: ['人間関係', '協力', '共感', 'チーム'] },
    { id: 'creativity', name: '創造・表現', keywords: ['創造', 'アート', '表現', 'オリジナル'] },
    { id: 'service', name: '貢献・奉仕', keywords: ['貢献', '助ける', '社会', 'サポート'] },
    { id: 'security', name: '安定・安全', keywords: ['安定', '安全', '保障', '継続'] },
    { id: 'knowledge', name: '知識・成長', keywords: ['学び', '知識', '成長', '理解'] },
    { id: 'adventure', name: '冒険・変化', keywords: ['冒険', '変化', '新しい', '刺激'] },
];
