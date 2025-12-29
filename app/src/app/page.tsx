'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import Lantern from '@/components/Lantern';
import ActionInputModal from '@/components/ActionInputModal';
import TodayAction from '@/components/TodayAction';
import ObstacleModal from '@/components/ObstacleModal';
import HabitCard from '@/components/HabitCard';
import ValueSpirit from '@/components/ValueSpirit';
import { useLanternStore } from '@/stores/lanternStore';
import { useValueSpiritStore } from '@/stores/valueSpiritStore';
import { useActionLogStore } from '@/stores/actionLogStore';
import type { LifeArea } from '@/types';

export default function HomePage() {
  const { lantern } = useLanternStore();
  const { todayGoal, setTodayGoal, completeGoal, setObstacle, getStreak } = useActionLogStore();
  const { incrementHabit } = useValueSpiritStore();

  const [showInputModal, setShowInputModal] = useState(false);
  const [showObstacleModal, setShowObstacleModal] = useState(false);
  const [obstacleLoading, setObstacleLoading] = useState(false);
  const [obstacleResult, setObstacleResult] = useState<{
    ifThenPlan: string;
    suggestions: string[];
  } | undefined>();

  // クライアントサイドでのみストリークを取得
  const [actionStreak, setActionStreak] = useState(0);
  useEffect(() => {
    setActionStreak(getStreak());
  }, [getStreak, todayGoal]);

  const handleSetGoal = (goalText: string, area: LifeArea) => {
    setTodayGoal(goalText, area);
  };

  const handleComplete = () => {
    completeGoal();
    // 習慣カウントを増やす（精霊の成長用）
    incrementHabit();
  };

  const handleObstacleSubmit = async (obstacle: string) => {
    if (!todayGoal) return;

    setObstacleLoading(true);
    try {
      const response = await fetch('/api/obstacle-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: todayGoal.goalText,
          obstacle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setObstacleResult({
          ifThenPlan: data.ifThenPlan,
          suggestions: data.suggestions,
        });
        // ストアにも保存
        setObstacle(obstacle, data.ifThenPlan);
      }
    } catch (error) {
      console.error('Failed to get obstacle plan:', error);
    } finally {
      setObstacleLoading(false);
    }
  };

  const handleCloseObstacleModal = () => {
    setShowObstacleModal(false);
    setObstacleResult(undefined);
  };

  // ランタンから価値観を取得
  const primaryValue = lantern?.flame?.primaryValue || null;

  return (
    <main className="min-h-screen bg-[var(--bg-abyss)] pb-40">
      {/* ヘッダー */}
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] bg-clip-text text-transparent">
          Value Lantern
        </h1>
        <p className="text-sm text-gray-400 mt-1">価値観を灯し、行動に変える</p>
      </header>

      {/* ランタンと精霊表示 */}
      <section className="py-4 flex justify-center items-start gap-12">
        <div className="flex flex-col items-center w-32">
          <Lantern
            flameValue={primaryValue || "?"}
            size="lg"
            animated={true}
          />
        </div>
        {primaryValue && (
          <div className="flex flex-col items-center w-32">
            <ValueSpirit />
          </div>
        )}
      </section>

      {/* TODAY'S ACTION セクション */}
      <section className="mb-6">
        {todayGoal ? (
          <TodayAction
            goal={todayGoal}
            onObstacleClick={() => setShowObstacleModal(true)}
            onComplete={handleComplete}
          />
        ) : (
          <div className="px-6">
            <button
              onClick={() => setShowInputModal(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] text-white font-bold text-lg hover:shadow-lg hover:shadow-[var(--flame-glow)]/30 transition-all"
            >
              🎯 今日の目標を設定
              <span className="block text-sm opacity-80 mt-1">価値観に沿った行動を1つ</span>
            </button>
          </div>
        )}
      </section>

      {/* ストリーク表示 */}
      {actionStreak > 0 && (
        <section className="text-center mb-6">
          <span className="streak-badge">
            🏆 {actionStreak}日連続
          </span>
        </section>
      )}

      {/* 習慣カード */}
      <section className="px-6 mb-6">
        <HabitCard compact />
      </section>

      {/* クイックアクション */}
      <section className="px-6 grid grid-cols-2 gap-4">
        <Link href="/diagnosis" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🔮</div>
          <h3 className="font-semibold">診断</h3>
          <p className="text-xs text-gray-400">価値観を発見する</p>
        </Link>

        <Link href="/lantern" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🏮</div>
          <h3 className="font-semibold">ランタン</h3>
          <p className="text-xs text-gray-400">価値観を確認する</p>
        </Link>

        <Link href="/habit" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="font-semibold">習慣</h3>
          <p className="text-xs text-gray-400">行動を習慣にする</p>
        </Link>

        <Link href="/reflection" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🪞</div>
          <h3 className="font-semibold">内省</h3>
          <p className="text-xs text-gray-400">振り返りを行う</p>
        </Link>
      </section>

      <BottomNav />

      {/* モーダル */}
      <ActionInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSave={handleSetGoal}
      />

      <ObstacleModal
        isOpen={showObstacleModal}
        goalText={todayGoal?.goalText || ''}
        onClose={handleCloseObstacleModal}
        onSubmit={handleObstacleSubmit}
        loading={obstacleLoading}
        result={obstacleResult}
      />
    </main>
  );
}
