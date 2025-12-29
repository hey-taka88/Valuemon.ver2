import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { VALUE_CARDS } from '@/data/valuesData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 価値観リストをプロンプト用に整形
const valuesList = VALUE_CARDS.map(v => `- ${v.id}: ${v.name} (${v.description})`).join('\n');

const ANALYSIS_PROMPT = `あなたは心理分析の専門家である。
ユーザーが「影の法廷」で行った証言（嫉妬・怒り・喪失についての回答）から、その人物のコア価値観を特定せよ。

【価値観リスト（88項目）】
${valuesList}

【分析ルール】
1. 嫉妬の証言 → 本当に欲しているもの（隠された渇望）
2. 怒りの証言 → 絶対に守りたいルール（核心的信念）
3. 喪失の証言 → アイデンティティの根幹（自己の土台）

【出力形式】
以下のJSON形式で返答せよ。IDは必ず上記リストのIDを使用すること：
{
  "values": [
    { "id": "V001", "name": "価値観名", "source": "envy", "confidence": 85, "evidence": "この価値観を示す証言の要約（50文字）" },
    { "id": "V002", "name": "価値観名", "source": "rage", "confidence": 75, "evidence": "この価値観を示す証言の要約（50文字）" },
    { "id": "V003", "name": "価値観名", "source": "loss", "confidence": 70, "evidence": "この価値観を示す証言の要約（50文字）" }
  ],
  "analysis": {
    "hiddenDesire": "嫉妬から読み取れる隠された野心（50文字）",
    "coreRule": "怒りから読み取れる譲れない正義（50文字）",
    "identity": "喪失から読み取れる自我の土台（50文字）"
  },
  "summary": "総合分析（100文字以内）"
}`;

export async function POST(request: NextRequest) {
    try {
        const { envyResponses, rageResponses, lossResponses } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `${ANALYSIS_PROMPT}

【被告人の証言記録】

■ 嫉妬フェーズ
${envyResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

■ 怒りフェーズ
${rageResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

■ 喪失フェーズ
${lossResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

上記の証言から価値観を分析し、JSON形式で返答せよ。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSONを抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return NextResponse.json(analysis);
        }

        return NextResponse.json({
            error: 'Failed to parse analysis',
            raw: text,
        });
    } catch (error) {
        console.error('Analysis API error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze responses' },
            { status: 500 }
        );
    }
}
