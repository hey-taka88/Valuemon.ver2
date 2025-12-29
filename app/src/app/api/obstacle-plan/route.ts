import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { goal, obstacle, valueContext } = await request.json();

        if (!goal || !obstacle) {
            return NextResponse.json(
                { error: 'goal and obstacle are required' },
                { status: 400 }
            );
        }

        const prompt = `あなたは習慣形成の専門家であり、ユーザーが目標を継続できるよう支援するコーチです。

ユーザーの目標: ${goal}
障害・困難: ${obstacle}
${valueContext ? `ユーザーの価値観: ${valueContext}` : ''}

以下の形式でJSON形式で返答してください：
{
  "ifThenPlan": "もし〇〇なら、△△する という形式の具体的なプラン（障害を避けるための実装意図）",
  "suggestions": [
    "着手ハードルをさらに下げた修正案1",
    "着手ハードルをさらに下げた修正案2",
    "環境設計の提案（障害を物理的に取り除く方法）"
  ]
}

重要なポイント:
1. If-Thenプランは「障害が発生する前のトリガー」を使う
2. 修正案は「これならできそう」と思える超簡単なレベルにする
3. 意志力に頼らず、環境や仕組みで解決する方法を優先
4. 励ましではなく、具体的で実行可能なアドバイスを`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json',
            },
        });

        const response = result.response;
        const text = response.text();

        // JSONをパース
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            // JSONパースに失敗した場合はテキストをそのまま返す
            parsed = {
                ifThenPlan: text,
                suggestions: [],
            };
        }

        return NextResponse.json({
            success: true,
            ifThenPlan: parsed.ifThenPlan || '',
            suggestions: parsed.suggestions || [],
        });

    } catch (error) {
        console.error('Obstacle plan error:', error);
        return NextResponse.json(
            { error: 'Failed to generate obstacle plan' },
            { status: 500 }
        );
    }
}
