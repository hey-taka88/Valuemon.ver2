'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setError('確認メールを送信しました。メールをご確認ください。');
                return;
            }

            router.push(redirectTo);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '認証エラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* ロゴ */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] bg-clip-text text-transparent">
                        Shadow Lantern
                    </h1>
                    <p className="text-gray-400 mt-2">
                        影から価値観を召喚する
                    </p>
                </div>

                {/* 認証フォーム */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-6 text-center">
                        {mode === 'login' ? 'ログイン' : '新規登録'}
                    </h2>

                    {/* Google認証 */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-800 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50 mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Googleでログイン
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--bg-card)] text-gray-400">または</span>
                        </div>
                    </div>

                    {/* メール認証 */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--flame-glow)]"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">パスワード</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--flame-glow)]"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className={`text-sm p-3 rounded-lg ${error.includes('確認メール')
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-red-900/30 text-red-400'
                                }`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {isLoading ? '処理中...' : mode === 'login' ? 'ログイン' : '新規登録'}
                        </button>
                    </form>

                    {/* モード切り替え */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {mode === 'login' ? (
                            <>
                                アカウントをお持ちでない方は{' '}
                                <button
                                    onClick={() => setMode('signup')}
                                    className="text-[var(--flame-glow)] hover:underline"
                                >
                                    新規登録
                                </button>
                            </>
                        ) : (
                            <>
                                すでにアカウントをお持ちの方は{' '}
                                <button
                                    onClick={() => setMode('login')}
                                    className="text-[var(--flame-glow)] hover:underline"
                                >
                                    ログイン
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ゲストモード */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
                        ログインせずに続ける（データは保存されません）
                    </Link>
                </div>
            </div>
        </main>
    );
}

function LoginLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--flame-glow)] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">読み込み中...</p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginForm />
        </Suspense>
    );
}

