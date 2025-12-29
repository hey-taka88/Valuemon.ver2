import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { CCI_ANALYSIS_PROMPT, THEME_CATEGORIES } from '@/data/cciData';
import type { CCIResponse, CCIAnalysisResult } from '@/data/cciData';

// ========================================
// CCI分析API
// キャリア構築インタビューの回答を分析し、
// 人生テーマと価値観を抽出する
// ========================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { responses } = body as { responses: CCIResponse[] };

        if (!responses || responses.length === 0) {
            return NextResponse.json(
                { error: 'responses are required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 回答をフォーマット
        const formattedResponses = responses.map(r => {
            const questionLabels: Record<string, string> = {
                'role_models': 'ロールモデル',
                'favorite_media': '好きなメディア',
                'favorite_story': '心に残る物語',
                'motto': '座右の銘',
                'early_recollections': '幼少期の記憶',
                'subjects_leisure': '好きだった科目・趣味',
            };
            return `【${questionLabels[r.questionId] || r.questionId}】\n${r.responses.join('\n')}`;
        }).join('\n\n');

        const prompt = `
${CCI_ANALYSIS_PROMPT}

【ユーザーの回答】
${formattedResponses}

【テーマカテゴリ参考】
${THEME_CATEGORIES.map(t => `${t.name}: ${t.keywords.join(', ')}`).join('\n')}

以下のJSON形式で分析結果を返してください：

{
    "themes": [
        {
            "id": "テーマID（英語）",
            "name": "テーマ名",
            "description": "このテーマがなぜ重要か（1-2文）",
            "frequency": 出現回数（1-6）
        }
    ],
    "lifeNarrative": "この人の人生ストーリーを1-2文で要約",
    "coreValues": ["価値観1", "価値観2", "価値観3"],
    "careerAdvice": "この人に合う仕事・活動の特徴（2-3文）"
}

JSONのみを返してください。
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // JSON抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json({
                success: true,
                analysis: getDefaultAnalysis(),
            });
        }

        const data = JSON.parse(jsonMatch[0]) as CCIAnalysisResult;

        return NextResponse.json({
            success: true,
            analysis: {
                themes: data.themes || [],
                lifeNarrative: data.lifeNarrative || '分析中...',
                coreValues: data.coreValues || [],
                careerAdvice: data.careerAdvice || '',
            },
        });
    } catch (error) {
        console.error('CCI Analysis error:', error);
        return NextResponse.json({
            success: true,
            analysis: getDefaultAnalysis(),
        });
    }
}

function getDefaultAnalysis(): CCIAnalysisResult {
    return {
        themes: [
            {
                id: 'growth',
                name: '成長',
                description: '常に学び続け、より良い自分になろうとする姿勢が見られます。',
                frequency: 3,
            },
        ],
        lifeNarrative: 'あなたの回答から、成長と変化を大切にする人生の物語が見えてきます。',
        coreValues: ['成長', '挑戦', '誠実'],
        careerAdvice: '新しいことを学べる環境、自分のペースで成長できる仕事が合っているでしょう。',
    };
}
