// 価値観カードデータ（88項目）
// values_master.json から抽出したカードソート用軽量版

export interface ValueCard {
    id: string;
    name: string;
    description: string;
    category: string;
    categoryColor: string;
}

export const VALUE_CATEGORIES = {
    achievement: { name: '達成・成長', color: '#3498db' },
    relationship: { name: '関係・つながり', color: '#e91e63' },
    autonomy: { name: '自律・自由', color: '#9b59b6' },
    security: { name: '安全・安定', color: '#2ecc71' },
    pleasure: { name: '快楽・刺激', color: '#f39c12' },
    meaning: { name: '意味・目的', color: '#1abc9c' },
    power: { name: '力・影響力', color: '#e74c3c' },
    tradition: { name: '伝統・秩序', color: '#95a5a6' },
};

export const VALUE_CARDS: ValueCard[] = [
    // 達成・成長
    { id: 'V001', name: '達成', description: '目標を達成し、成功を収めること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V002', name: '能力', description: '高い能力を持ち、それを発揮すること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V003', name: '成長', description: '常に学び、成長し続けること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V004', name: '知識', description: '知識を深め、理解を広げること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V005', name: '挑戦', description: '困難に挑み、限界を超えること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V006', name: '勤勉', description: '努力を惜しまず、真摯に取り組むこと', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V007', name: '熟達', description: 'スキルを極め、エキスパートになること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V008', name: '正確性', description: '正確で精密な仕事をすること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V009', name: '効率', description: '無駄なく効率的に物事を進めること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V010', name: '創造性', description: '新しいアイデアを生み出すこと', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V011', name: '好奇心', description: '新しいことに興味を持ち探求すること', category: 'achievement', categoryColor: '#3498db' },

    // 関係・つながり
    { id: 'V012', name: '愛情', description: '愛し愛されること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V013', name: '家族', description: '家族との絆を大切にすること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V014', name: '友情', description: '友人との関係を育むこと', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V015', name: '所属', description: 'コミュニティの一員であること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V016', name: '貢献', description: '他者や社会に貢献すること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V017', name: '協力', description: '他者と協力して物事を成し遂げること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V018', name: '思いやり', description: '他者を気遣い、配慮すること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V019', name: '寛容', description: '他者の違いを受け入れること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V020', name: '忠誠', description: '信頼関係を守り続けること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V021', name: '親密さ', description: '深いつながりを持つこと', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V022', name: '養育', description: '他者を育て、守ること', category: 'relationship', categoryColor: '#e91e63' },

    // 自律・自由
    { id: 'V023', name: '自由', description: '束縛されず、自由に生きること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V024', name: '自立', description: '自分の力で生きること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V025', name: '自己決定', description: '自分で選択し、決断すること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V026', name: '個性', description: '自分らしさを大切にすること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V027', name: '本物', description: '偽りなく、本当の自分でいること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V028', name: '柔軟性', description: '変化に適応し、柔軟であること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V029', name: 'プライバシー', description: '自分の領域を守ること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V030', name: 'マインドフルネス', description: '今この瞬間に意識を向けること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V031', name: '内なる平和', description: '心の平穏を保つこと', category: 'autonomy', categoryColor: '#9b59b6' },

    // 安全・安定
    { id: 'V032', name: '安全', description: '危険から守られていること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V033', name: '安定', description: '変化の少ない安定した生活', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V034', name: '健康', description: '心身ともに健康であること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V035', name: '経済的安定', description: '経済的に安定していること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V036', name: '秩序', description: '整理整頓された環境', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V037', name: '責任', description: '責任を果たすこと', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V038', name: '信頼性', description: '信頼される人間であること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V039', name: '自己規律', description: '自分を律すること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V040', name: '節度', description: '適度を保つこと', category: 'security', categoryColor: '#2ecc71' },

    // 快楽・刺激
    { id: 'V041', name: '快楽', description: '楽しみや喜びを感じること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V042', name: '冒険', description: '新しい経験や刺激を求めること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V043', name: '興奮', description: 'ワクワクする体験をすること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V044', name: '美', description: '美しいものを愛でること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V045', name: 'ユーモア', description: '笑いや楽しさを大切にすること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V046', name: '遊び', description: '遊び心を持ち続けること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V047', name: '快適さ', description: '快適な環境で過ごすこと', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V048', name: 'レジャー', description: '余暇を楽しむこと', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V049', name: '多様性', description: '多様な経験をすること', category: 'pleasure', categoryColor: '#f39c12' },
    { id: 'V050', name: '感性', description: '感受性を大切にすること', category: 'pleasure', categoryColor: '#f39c12' },

    // 意味・目的
    { id: 'V051', name: '意味', description: '人生に意味を見出すこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V052', name: '目的', description: '明確な目的を持って生きること', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V053', name: '使命', description: '自分の使命を果たすこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V054', name: '希望', description: '未来に希望を持つこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V055', name: '信仰', description: '精神的な信念を持つこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V056', name: '感謝', description: '感謝の気持ちを持つこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V057', name: '奉仕', description: '他者のために尽くすこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V058', name: '世界観', description: '独自の世界観を持つこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V059', name: '遺産', description: '後世に残るものを作ること', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V060', name: '環境保護', description: '自然環境を守ること', category: 'meaning', categoryColor: '#1abc9c' },

    // 力・影響力
    { id: 'V061', name: '影響力', description: '他者や社会に影響を与えること', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V062', name: 'リーダーシップ', description: '人を導くこと', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V063', name: '権力', description: '権力や地位を持つこと', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V064', name: '名声', description: '名声や評価を得ること', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V065', name: '富', description: '経済的な豊かさを持つこと', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V066', name: '支配', description: 'コントロールを持つこと', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V067', name: '認知', description: '他者から認められること', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V068', name: '競争', description: '競争に勝つこと', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V069', name: '勝利', description: '勝利を収めること', category: 'power', categoryColor: '#e74c3c' },
    { id: 'V070', name: '主張', description: '自分の意見を主張すること', category: 'power', categoryColor: '#e74c3c' },

    // 伝統・秩序
    { id: 'V071', name: '伝統', description: '伝統や慣習を重んじること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V072', name: '規律', description: 'ルールを守ること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V073', name: '正義', description: '正しさを追求すること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V074', name: '誠実', description: '誠実で正直であること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V075', name: '謙虚', description: '謙虚であること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V076', name: '礼節', description: '礼儀正しくあること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V077', name: '調和', description: '調和を保つこと', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V078', name: '服従', description: '権威に従うこと', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V079', name: '愛国心', description: '国や地域を愛すること', category: 'tradition', categoryColor: '#95a5a6' },
    { id: 'V080', name: '文化', description: '文化を守り継承すること', category: 'tradition', categoryColor: '#95a5a6' },

    // 追加項目（Brené Brown統合）
    { id: 'V081', name: '本物らしさ', description: '偽りのない自分でいること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V082', name: '勇気', description: '恐れを乗り越えて行動すること', category: 'achievement', categoryColor: '#3498db' },
    { id: 'V083', name: '脆弱性', description: '弱さを見せる勇気を持つこと', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V084', name: '共感', description: '他者の感情を理解すること', category: 'relationship', categoryColor: '#e91e63' },
    { id: 'V085', name: '境界線', description: '適切な境界線を設けること', category: 'security', categoryColor: '#2ecc71' },
    { id: 'V086', name: '完全性', description: '自分を完全に受け入れること', category: 'autonomy', categoryColor: '#9b59b6' },
    { id: 'V087', name: '恥への対処', description: '恥を乗り越える力を持つこと', category: 'meaning', categoryColor: '#1abc9c' },
    { id: 'V088', name: '帰属', description: '本当の居場所を持つこと', category: 'relationship', categoryColor: '#e91e63' },
];

// カードをシャッフルする関数
export function shuffleCards(cards: ValueCard[]): ValueCard[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
