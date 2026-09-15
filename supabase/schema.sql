-- ==============================================================================
-- X09 STUDIO - PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Domain: studio.x09.com.br
-- Multi-tenant SaaS architecture for users, projects, credits, subscriptions & payments
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Configuration constants for credit economy
-- New user initial bonus: 15 credits
-- New project cost: 5 credits
-- Template clone cost: 5 credits
-- AI code generation command: 1 credit

-- ==============================================================================
-- TABLE: profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('admin', 'creator')),
  plan TEXT NOT NULL DEFAULT 'Free' CHECK (plan IN ('Free', 'Starter', 'Pro', 'Scale')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: credit_balances
-- Atomic source of truth for user credit balances
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.credit_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 15 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 15 CHECK (total_earned >= 0),
  total_spent INTEGER NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: credit_transactions
-- Immutable ledger of every credit movement
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Negative for deductions, positive for recharges/bonuses
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'welcome_bonus',
    'purchase',
    'subscription',
    'generation',
    'project_creation',
    'template_clone',
    'refund',
    'adjustment'
  )),
  description TEXT NOT NULL,
  reference_id TEXT, -- ID of project, payment or subscription
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- ==============================================================================
-- TABLE: templates (Official X09 Templates - Read-only for creators, admin managed)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Sites', 'SaaS', 'Apps', 'E-commerces')),
  badge TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  suggested_subdomain TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: projects (User projects)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  custom_domain TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Sites' CHECK (category IN ('Sites', 'SaaS', 'Apps', 'E-commerces')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'interviewing',
    'planning',
    'designing',
    'building',
    'reviewing',
    'published',
    'archived'
  )),
  views INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  template_id TEXT REFERENCES public.templates(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_subdomain UNIQUE (subdomain)
);

CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_subdomain ON public.projects(subdomain);

-- ==============================================================================
-- TABLE: project_versions
-- History of versions and checkpoints for rolling back changes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  commit_message TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project ON public.project_versions(project_id, version_number DESC);

-- ==============================================================================
-- TABLE: subscriptions (Mercado Pago Subscriptions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('starter', 'pro', 'scale')),
  subscription_id TEXT UNIQUE, -- Mercado Pago Preapproval ID
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'active', 'paused', 'cancelled')),
  amount NUMERIC(10, 2) NOT NULL,
  credits_monthly INTEGER NOT NULL,
  provider TEXT NOT NULL DEFAULT 'mercadopago',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

-- ==============================================================================
-- TABLE: payments (Mercado Pago Credit Recharges & Invoices with Idempotency)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT UNIQUE NOT NULL, -- Mercado Pago Payment ID (idempotency key)
  package_id TEXT,
  plan_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'in_process', 'rejected', 'refunded')),
  credits INTEGER NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'mercadopago',
  payment_method TEXT, -- 'pix', 'credit_card', etc.
  raw_payload JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments(payment_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict multi-tenant isolation: No user can read or modify another user's data
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Credit Balances (Users can only view their own balance, updates via atomic RPC only)
CREATE POLICY "Users can view own credit balance"
  ON public.credit_balances FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Credit Transactions (Users can only view their own ledger)
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Templates (All authenticated and public users can read templates, cannot write)
CREATE POLICY "Anyone can view active templates"
  ON public.templates FOR SELECT
  USING (is_active = true);

-- 5. Projects (Strict ownership isolation)
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);

-- 6. Project Versions
CREATE POLICY "Users can view own project versions"
  ON public.project_versions FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own project versions"
  ON public.project_versions FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 7. Subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 8. Payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ==============================================================================
-- DATABASE STORED PROCEDURES & TRIGGERS
-- ==============================================================================

-- Trigger: Automatically create Profile and initial 15 Credit Balance on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Insert Profile
  INSERT INTO public.profiles (id, email, name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    'creator',
    'Free'
  );

  -- 2. Insert initial Credit Balance (15 bonus credits)
  INSERT INTO public.credit_balances (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, 15, 15, 0);

  -- 3. Record Initial Welcome Transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    balance_before,
    balance_after,
    type,
    description
  ) VALUES (
    NEW.id,
    15,
    0,
    15,
    'welcome_bonus',
    'Créditos de boas-vindas do Studio X09'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_signup();

-- ==============================================================================
-- ATOMIC STORED PROCEDURE: consume_user_credits
-- Performs atomic balance verification, deduction, and transaction logging
-- Prevents race conditions and guarantees non-negative balance
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.consume_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_total_spent INTEGER;
  v_tx_id UUID;
BEGIN
  -- Check user authorization: caller must be owner or service role
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: cannot spend another user credits');
  END IF;

  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Amount must be greater than 0');
  END IF;

  -- Row lock with SELECT FOR UPDATE to prevent race conditions
  SELECT balance, total_spent INTO v_current_balance, v_total_spent
  FROM public.credit_balances
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Credit balance record not found');
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Update balance
  UPDATE public.credit_balances
  SET
    balance = v_new_balance,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    balance_before,
    balance_after,
    type,
    description,
    reference_id
  ) VALUES (
    p_user_id,
    -p_amount,
    v_current_balance,
    v_new_balance,
    p_type,
    p_description,
    p_reference_id
  ) RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'success', true,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance,
    'deducted', p_amount,
    'transaction_id', v_tx_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ATOMIC STORED PROCEDURE: add_user_credits_idempotent
-- Processes Mercado Pago payments idempotently: duplicate calls will not grant double credits
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.add_user_credits_idempotent(
  p_user_id UUID,
  p_payment_id TEXT,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_price_brl NUMERIC,
  p_raw_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_existing_payment RECORD;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_tx_id UUID;
BEGIN
  -- Idempotency check: verify if payment was already recorded and approved
  SELECT * INTO v_existing_payment
  FROM public.payments
  WHERE payment_id = p_payment_id;

  IF FOUND AND v_existing_payment.status = 'approved' THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'message', 'Payment already processed and credited',
      'payment_id', p_payment_id
    );
  END IF;

  -- Lock balance row
  SELECT balance INTO v_current_balance
  FROM public.credit_balances
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- In case balance row was missing, initialize
    INSERT INTO public.credit_balances (user_id, balance, total_earned, total_spent)
    VALUES (p_user_id, 0, 0, 0);
    v_current_balance := 0;
  END IF;

  v_new_balance := v_current_balance + p_amount;

  -- Update balance
  UPDATE public.credit_balances
  SET
    balance = v_new_balance,
    total_earned = total_earned + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record credit transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    balance_before,
    balance_after,
    type,
    description,
    reference_id
  ) VALUES (
    p_user_id,
    p_amount,
    v_current_balance,
    v_new_balance,
    p_type,
    p_description,
    p_payment_id
  ) RETURNING id INTO v_tx_id;

  -- Insert or update payment record
  INSERT INTO public.payments (
    user_id,
    payment_id,
    amount,
    status,
    credits,
    provider,
    raw_payload,
    processed_at
  ) VALUES (
    p_user_id,
    p_payment_id,
    p_price_brl,
    'approved',
    p_amount,
    'mercadopago',
    p_raw_payload,
    NOW()
  )
  ON CONFLICT (payment_id) DO UPDATE
  SET
    status = 'approved',
    credits = p_amount,
    processed_at = NOW(),
    updated_at = NOW();

  RETURN jsonb_build_object(
    'success', true,
    'already_processed', false,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance,
    'credited', p_amount,
    'payment_id', p_payment_id,
    'transaction_id', v_tx_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
