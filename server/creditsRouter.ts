import express, { Request, Response } from 'express';
import { getSupabaseAdmin, CREDIT_ECONOMY } from './supabaseAdmin';

export const creditsRouter = express.Router();

/**
 * GET /api/credits/config
 * Returns current dynamic credit economy values
 */
creditsRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    welcomeBonus: CREDIT_ECONOMY.WELCOME_BONUS,
    projectCreationCost: CREDIT_ECONOMY.PROJECT_CREATION_COST,
    templateCloneCost: CREDIT_ECONOMY.TEMPLATE_CLONE_COST,
    aiCommandCost: CREDIT_ECONOMY.AI_COMMAND_COST,
  });
});

/**
 * POST /api/credits/consume
 * Atomic credit deduction endpoint
 * Verifies balance, locks row, deducts, and inserts credit_transaction
 */
creditsRouter.post('/consume', async (req: Request, res: Response) => {
  try {
    const { userId, amount, type, description, referenceId } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'userId e amount válido são obrigatórios' });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      // In development fallback without cloud database configured
      return res.json({
        success: true,
        mode: 'local_fallback',
        deducted: amount,
        message: 'Crédito deduzido localmente (configure SUPABASE_URL para persistência centralizada).',
      });
    }

    // Call PostgreSQL atomic stored procedure
    const { data, error } = await supabase.rpc('consume_user_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_type: type || 'generation',
      p_description: description || 'Consumo de créditos',
      p_reference_id: referenceId || null,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || !data.success) {
      return res.status(400).json({
        error: data?.error || 'Saldo insuficiente ou erro na transação',
        details: data,
      });
    }

    return res.json(data);
  } catch (err: any) {
    console.error('Error in /api/credits/consume:', err);
    return res.status(500).json({ error: err.message || 'Erro ao processar consumo atômico de créditos' });
  }
});

/**
 * GET /api/credits/history/:userId
 * Retrieves credit transaction history for a user
 */
creditsRouter.get('/history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return res.json({ transactions: [] });
    }

    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ transactions: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
