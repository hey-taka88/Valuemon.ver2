import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { VALUE_CARDS } from '@/data/valuesData';
import { SENTENCE_CATEGORIES } from '@/data/sentenceData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 価値観リストをプロンプト用に整形
const valuesList = VALUE_CARDS.map(v => `- ${v.id}: ${v.name} (${v.description})`).join('\n');

// カテゴリ情報
const categoryInfo = SENTENCE_CATEGORIES.map(c => `- ${c.id}: ${c.name} (${c.emoji})`).join('\n');

const ANALYSIS_PROMPT = `あなたは心理分析の専門家である。
ユーザーが「アンフィニッシュド・センテンス」（文章穴埋め）で記入した回答から、その人物のコア価値観を特定せよ。

【カテゴリ情報】
${categoryInfo}

【価値観リスト（88項目）】
${valuesList}

【分析ルール】
1. 各カテゴリの回答から、その領域で重視している価値観を特定
2. 言葉の選び方、表現の強さから確信度を判断
3. 全体を通じて最も頻出・強調される価値観を「primaryValue」とする

【出力形式】
以下のJSON形式で返答せよ。IDは必ず上記リストのIDを使用すること：
{
  "categories": [
    {
      "categoryId": "money",
      "categoryName": "お金",
      "emoji": "💰",
      "values": [
        { "id": "V035", "name": "経済的安定", "confidence": 80, "evidence": "回答から読み取れた根拠（30文字）" }
      ]
    }
  ],
  "primaryValue": { "id": "V001", "name": "価値観名", "confidence": 85 },
  "summary": "全体を通じた分析サマリー（100文字以内）"
}`;

export async function POST(request: NextRequest) {
    try {
        const { responses } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        // 回答をフォーマット
        const formattedResponses = Object.entries(responses)
            .map(([categoryId, answers]) => {
                const cat = SENTENCE_CATEGORIES.find(c => c.id === categoryId);
                const answerList = (answers as string[]).map((a, i) => `  ${i + 1}. ${a}`).join('\n');
                return `■ ${cat?.name || categoryId} (${cat?.emoji || ''})\n${answerList}`;
            })
            .join('\n\n');

        const prompt = `${ANALYSIS_PROMPT}

【ユーザーの回答】
${formattedResponses}

上記の回答から価値観を分析し、JSON形式で返答せよ。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Analysis Result:', text.substring(0, 200) + '...');

        try {
            // JSONモードを使用しているため、直接パースを試みる
            const analysis = JSON.parse(text);
            return NextResponse.json(analysis);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw text:', text);

            // フォールバック: Regexでの抽出
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);
                return NextResponse.json(analysis);
            }

            return NextResponse.json({
                error: 'Failed to parse analysis',
                raw: text,
            });
        }
    } catch (error) {
        console.error('Sentence Analysis API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to analyze responses',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
