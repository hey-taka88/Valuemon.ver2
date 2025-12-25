-- Shadow Lantern Database Schema
-- Supabase/PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Profile (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name VARCHAR(100),
    avatar_url TEXT,
    preferred_module VARCHAR(20) DEFAULT 'shadow',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Shadow Logs (診断ログ)
-- ============================================
CREATE TABLE public.shadow_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    emotion_type VARCHAR(10) NOT NULL CHECK (emotion_type IN ('envy', 'rage', 'loss')),
    target_description TEXT,
    intensity INTEGER CHECK (intensity >= 0 AND intensity <= 10),
    analyzed_value_ids TEXT[],
    factor_scores JSONB,
    detected_discrepancies JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shadow_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shadow logs" ON public.shadow_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shadow logs" ON public.shadow_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- User Lanterns (バリューランタン)
-- ============================================
CREATE TABLE public.user_lanterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    flame JSONB NOT NULL,
    protection JSONB,
    handle JSONB,
    light JSONB,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_lanterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lanterns" ON public.user_lanterns
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lanterns" ON public.user_lanterns
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lanterns" ON public.user_lanterns
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Monster Status (モンスターステータス)
-- ============================================
CREATE TABLE public.monster_status (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    element VARCHAR(10) NOT NULL CHECK (element IN ('fire', 'water', 'wind', 'earth', 'light', 'dark')),
    current_form VARCHAR(20) DEFAULT 'wisp',
    total_xp INTEGER DEFAULT 0,
    openness INTEGER DEFAULT 50 CHECK (openness >= 0 AND openness <= 100),
    conscientiousness INTEGER DEFAULT 50 CHECK (conscientiousness >= 0 AND conscientiousness <= 100),
    extraversion INTEGER DEFAULT 50 CHECK (extraversion >= 0 AND extraversion <= 100),
    agreeableness INTEGER DEFAULT 50 CHECK (agreeableness >= 0 AND agreeableness <= 100),
    emotional_stability INTEGER DEFAULT 50 CHECK (emotional_stability >= 0 AND emotional_stability <= 100),
    unlocked_skills TEXT[],
    darkside_warnings TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.monster_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own monster" ON public.monster_status
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monster" ON public.monster_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own monster" ON public.monster_status
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Action Logs (行動ログ)
-- ============================================
CREATE TABLE public.action_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
    action_type VARCHAR(100),
    life_area VARCHAR(20) CHECK (life_area IN ('work', 'play', 'relationship', 'growth', 'money', 'spiritual')),
    stat_changes JSONB,
    reward_used VARCHAR(200),
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own action logs" ON public.action_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own action logs" ON public.action_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Habit Records (習慣記録)
-- ============================================
CREATE TABLE public.habit_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    habit_name VARCHAR(200) NOT NULL,
    reward VARCHAR(200),
    streak INTEGER DEFAULT 0,
    reward_test_passed BOOLEAN DEFAULT FALSE,
    last_completed DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habit_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits" ON public.habit_records
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habit_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habit_records
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Skill Usage Logs (スキル使用ログ)
-- ============================================
CREATE TABLE public.skill_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    skill_id VARCHAR(50) NOT NULL,
    context TEXT,
    input_data TEXT,
    output_data TEXT,
    effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 5),
    used_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skill_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill logs" ON public.skill_usage_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill logs" ON public.skill_usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_shadow_logs_user ON public.shadow_logs(user_id);
CREATE INDEX idx_shadow_logs_created ON public.shadow_logs(created_at DESC);
CREATE INDEX idx_action_logs_user ON public.action_logs(user_id);
CREATE INDEX idx_action_logs_logged ON public.action_logs(logged_at DESC);
CREATE INDEX idx_user_lanterns_user ON public.user_lanterns(user_id);
CREATE INDEX idx_habit_records_user ON public.habit_records(user_id);
