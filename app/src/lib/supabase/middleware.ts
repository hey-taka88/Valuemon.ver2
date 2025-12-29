import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // 環境変数が設定されていない場合はスキップ
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase環境変数が設定されていません');
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        supabaseResponse = NextResponse.next({ request });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Refreshing the auth token
        const { data: { user } } = await supabase.auth.getUser();

        // Protected routes (認証必須ページ)
        // 現在は認証必須ページなし（ゲストモードで全機能利用可能）
        const protectedPaths: string[] = [];
        const isProtectedPath = protectedPaths.some((path) =>
            request.nextUrl.pathname.startsWith(path)
        );

        if (isProtectedPath && !user) {
            const url = request.nextUrl.clone();
            url.pathname = '/auth/login';
            url.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    } catch (error) {
        console.error('Middleware error:', error);
        // エラーが発生しても続行
        return NextResponse.next({ request });
    }
}
