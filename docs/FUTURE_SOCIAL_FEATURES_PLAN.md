# Big5ベース ソーシャル機能 実装計画書

> **ステータス**: 📋 計画段階（知人フィードバック後に着手予定）  
> **作成日**: 2025-12-29  
> **最終更新**: 2025-12-29

---

## 概要

ユーザーのBig5性格特性を裏データとして測定し、**異なる価値観を持つ人々のアイデアや習慣**を確認・意見交換できるソーシャル機能を実装する。

### 目的
- 自分とは違う視点からの気づきを得る
- 多様な価値観・習慣に触れることで視野を広げる
- ユーザー間の継続利用モチベーションを高める

---

## Phase 1: Big5診断モジュール

### 1.1 概要
TIPI-J（10項目版）を使用した簡易Big5診断を実装。

### 1.2 実装内容

| ファイル | 説明 |
|---------|------|
| `src/data/big5Data.ts` | TIPI-J質問項目（10問）とスコアリングロジック |
| `src/stores/big5Store.ts` | Big5スコアの状態管理 |
| `src/app/diagnosis/big5/page.tsx` | 診断UI（スワイプ形式） |
| `src/app/diagnosis/big5/result/page.tsx` | 結果表示ページ |

### 1.3 Big5の5因子

| 因子 | 英語名 | 高スコアの特徴 |
|-----|--------|---------------|
| 外向性 | Extraversion (E) | 社交的、活発 |
| 協調性 | Agreeableness (A) | 思いやりがある、協力的 |
| 勤勉性 | Conscientiousness (C) | 計画的、自己規律が高い |
| 神経症的傾向 | Neuroticism (N) | 感情の起伏が大きい |
| 開放性 | Openness (O) | 好奇心旺盛、創造的 |

### 1.4 TIPI-J 質問項目（参考）

```typescript
const TIPI_J_QUESTIONS = [
  { id: 1, text: "活発で、外向的だと思う", factor: "E", reverse: false },
  { id: 2, text: "他人に不満をもち、もめごとを起こしやすいと思う", factor: "A", reverse: true },
  { id: 3, text: "しっかりしていて、自分に厳しいと思う", factor: "C", reverse: false },
  { id: 4, text: "心配性で、うろたえやすいと思う", factor: "N", reverse: false },
  { id: 5, text: "新しいことが好きで、変わった考えをもつと思う", factor: "O", reverse: false },
  { id: 6, text: "ひかえめで、おとなしいと思う", factor: "E", reverse: true },
  { id: 7, text: "人に気をつかう、やさしい人間だと思う", factor: "A", reverse: false },
  { id: 8, text: "だらしなく、うっかりしていると思う", factor: "C", reverse: true },
  { id: 9, text: "冷静で、気分が安定していると思う", factor: "N", reverse: true },
  { id: 10, text: "発想力に欠けた、平凡な人間だと思う", factor: "O", reverse: true },
];
```

### 1.5 スコアリングロジック

```typescript
// 7段階評価（1〜7）
// 逆転項目: 8 - 回答値
// 各因子 = (正転項目 + 逆転項目) / 2
```

---

## Phase 1.5: 進化連動型Big5収集 ⭐ 推奨アプローチ

> **コンセプト**: 50問を一度に答えさせるのではなく、モンスター進化のタイミングで10問ずつ段階的に収集する。

### 1.5.1 進化ステージとの対応

| 進化段階 | 質問数 | 累計 | Big5精度 | ソーシャル機能 |
|---------|-------|------|---------|--------------|
| Stage 1→2 | 10問 | 10問 | 暫定スコア | 閲覧のみ |
| Stage 2→3 | 10問 | 20問 | 向上 | いいね可能 |
| Stage 3→4 | 10問 | 30問 | 向上 | コメント可能 |
| Stage 4→5 | 10問 | 40問 | 向上 | アイデア投稿可能 |
| Stage 5→6 | 10問 | 50問 | 完全 | 全機能解放 |

### 1.5.2 メリット

1. **ユーザー負担の軽減** - 50問一括より心理的ハードルが低い
2. **継続モチベーション** - 「次の進化で新機能解禁」という期待感
3. **段階的な精度向上** - 進化とともにBig5プロファイルが精緻化
4. **自然なゲームフロー** - 進化＝成長＝自己理解という一貫性

### 1.5.3 実装設計

```typescript
// 進化時に表示する質問のマッピング
const EVOLUTION_QUESTIONS: Record<number, number[]> = {
  2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],     // Stage 1→2
  3: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Stage 2→3
  4: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // Stage 3→4
  5: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], // Stage 4→5
  6: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50], // Stage 5→6
};

// 進化処理に質問モーダルを挟む
function evolveMonster(monsterId: string, targetStage: number) {
  const questions = EVOLUTION_QUESTIONS[targetStage];
  // 質問に回答後、進化を完了
}
```

### 1.5.4 質問配分の最適化

各因子（E, A, C, N, O）の質問を均等に配分し、どの段階でも暫定スコアが計算できるようにする：

```
Stage 1→2: E×2, A×2, C×2, N×2, O×2 = 10問
Stage 2→3: E×2, A×2, C×2, N×2, O×2 = 10問
... 以下同様
```

---

## Phase 2: データベース設計（Supabase）

### 2.1 テーブル構成

```sql
-- ユーザープロファイル（匿名ID）
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT UNIQUE NOT NULL,
  big5_e DECIMAL(3,2),  -- 外向性 (1.0〜7.0)
  big5_a DECIMAL(3,2),  -- 協調性
  big5_c DECIMAL(3,2),  -- 勤勉性
  big5_n DECIMAL(3,2),  -- 神経症的傾向
  big5_o DECIMAL(3,2),  -- 開放性
  sharing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 共有アイデア・習慣
CREATE TABLE shared_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  type TEXT CHECK (type IN ('habit', 'idea', 'goal')),
  title TEXT NOT NULL,
  description TEXT,
  value_id TEXT,  -- 関連する価値観ID
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- いいね
CREATE TABLE idea_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES shared_ideas(id),
  user_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- コメント（Phase 3）
CREATE TABLE idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES shared_ideas(id),
  user_id UUID REFERENCES user_profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 プライバシー設計

- **匿名ID**: ユーザー名は表示せず、匿名IDのみ
- **オプトイン**: `sharing_enabled` がtrueの場合のみ共有
- **Big5スコア非公開**: 他ユーザーのスコアは直接見えない（マッチングにのみ使用）

---

## Phase 3: ソーシャル機能UI

### 3.1 アイデア閲覧機能

| ファイル | 説明 |
|---------|------|
| `src/app/discover/page.tsx` | 他者のアイデア一覧 |
| `src/components/IdeaCard.tsx` | アイデア表示カード |
| `src/stores/discoverStore.ts` | ソーシャル機能の状態管理 |

### 3.2 フィルタリングオプション

```typescript
type DiscoverFilter = {
  // 価値観ベース
  sameValues: boolean;      // 同じ価値観を持つ人
  differentValues: boolean; // 違う価値観を持つ人
  
  // Big5ベース（内部利用）
  personalityDistance: 'similar' | 'different' | 'all';
  
  // コンテンツタイプ
  contentType: 'habit' | 'idea' | 'goal' | 'all';
};
```

### 3.3 マッチングアルゴリズム

```typescript
// Big5プロファイル間のユークリッド距離を計算
function calculatePersonalityDistance(
  user1: Big5Profile,
  user2: Big5Profile
): number {
  const factors = ['e', 'a', 'c', 'n', 'o'];
  const squaredDiffs = factors.map(f => 
    Math.pow(user1[f] - user2[f], 2)
  );
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0));
}

// 「違う価値観の人」の定義
// distance > 3.0 を「異なる」と判定（要調整）
```

---

## Phase 4: 意見交換機能

### 4.1 実装内容

| 機能 | 説明 |
|-----|------|
| いいね | アイデアへのリアクション |
| コメント | 匿名でのコメント |
| 返信 | コメントへの返信（ネスト1段階まで） |

### 4.2 モデレーション

- 不適切コンテンツの報告機能
- AI（Gemini）による自動フィルタリング
- 管理者レビューキュー

---

## 実装優先度

```
┌─────────────────────────────────────────────────────────┐
│ 高優先度（Phase 1-2）                                    │
│ ✅ 現行アプリの知人フィードバック完了後                    │
├─────────────────────────────────────────────────────────┤
│ 1. Big5診断モジュール                                    │
│    - TIPI-J質問UI                                       │
│    - ローカルストレージ保存                              │
│    - 結果表示ページ                                      │
├─────────────────────────────────────────────────────────┤
│ 2. Supabaseスキーマ作成                                  │
│    - user_profiles テーブル                              │
│    - shared_ideas テーブル                               │
│    - RLSポリシー設定                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 中優先度（Phase 3）                                      │
├─────────────────────────────────────────────────────────┤
│ 3. アイデア共有機能                                      │
│    - 自分のアイデア/習慣を共有                           │
│    - 他者のアイデア閲覧（読み取り専用）                   │
│    - フィルタリング機能                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 低優先度（Phase 4）                                      │
├─────────────────────────────────────────────────────────┤
│ 4. インタラクション機能                                  │
│    - いいね機能                                          │
│    - コメント機能                                        │
│    - 通知機能                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 技術的検討事項

### 認証
- Supabase Auth（匿名認証 or メール認証）
- デバイスIDベースの仮認証も検討

### パフォーマンス
- アイデア一覧のページネーション
- Big5マッチング計算のバッチ処理

### セキュリティ
- Row Level Security (RLS) の適切な設定
- レートリミット（API呼び出し制限）

---

## 参考資料

- [ビッグファイブ性格特性の辛口分析と活用法.txt](/Users/yo-hey/Valuemon/ビッグファイブ性格特性の辛口分析と活用法.txt)
- TIPI-J（日本語版10項目性格検査）
- Supabase公式ドキュメント

---

> 📝 **Next Step**: 知人からのフィードバック完了後、Phase 1のBig5診断モジュールから着手予定
