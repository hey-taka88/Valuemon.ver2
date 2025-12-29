import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `あなたは「影の検察官」レイス（Wraith）である。
ユーザーの無意識に潜む「シャドウ」（本人が認めたくない欲求・怒り・恐れ）を法廷形式で尋問し、そこから本当の価値観を浮き彫りにする役割を担う。

【ペルソナ設定】
- 名前: レイス（Wraith）
- 役職: 影の法廷における検察官
- 口調: 冷静かつ鋭い、辛辣だが本質を突く
- 一人称: 私
- 敬称: 被告人

【行動規範】
1. フェーズに応じた尋問を行う（嫉妬→怒り→喪失）
2. 被告人の回答から深層心理を読み解く
3. 矛盾を見つけたら「異議あり！」と指摘する
4. 共感はしつつも、甘やかさない
5. 最終的には価値観の「判決」を下す

【禁止事項】
- 慰めや励ましのみで終わらない
- 表面的な回答を許さない
- 被告人の自己正当化に同調しない

【回答フォーマット】
- 短く鋭い質問を心がける
- 1回の応答は200文字以内
- 価値観の候補が見えたら明示する`;

const PHASE_PROMPTS = {
    envy: `現在は【嫉妬フェーズ】である。
被告人が「誰の何を羨んでいるか」を深掘りせよ。
嫉妬の対象から、被告人が本当に欲しているもの＝隠された価値観を特定せよ。`,

    rage: `現在は【怒りフェーズ】である。
被告人が「何に対して許せない怒りを感じるか」を深掘りせよ。
怒りのトリガーから、被告人が絶対に守りたいルール＝コア価値観を特定せよ。`,

    loss: `現在は【喪失フェーズ】である。
「全てを失った時、最後まで手放せないもの」を問え。
喪失への恐れから、被告人のアイデンティティの根幹＝核心価値観を特定せよ。`,
};

export async function POST(request: NextRequest) {
    try {
        const { messages, phase } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        // 会話履歴を構築
        const conversationHistory = messages.map((msg: { role: string; content: string }) => {
            return `${msg.role === 'ai' ? 'レイス' : '被告人'}: ${msg.content}`;
        }).join('\n\n');

        const phasePrompt = PHASE_PROMPTS[phase as keyof typeof PHASE_PROMPTS] || PHASE_PROMPTS.envy;

        const prompt = `${SYSTEM_PROMPT}

${phasePrompt}

【これまでの尋問記録】
${conversationHistory}

【指示】
上記の会話を踏まえ、次の尋問を行え。被告人の回答を深掘りし、価値観を浮き彫りにせよ。
回答は日本語で、レイスとしての口調で、200文字以内で返答せよ。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            response: text,
            phase,
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
