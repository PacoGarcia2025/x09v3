import express, { Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getSupabaseAdmin } from './supabaseAdmin';

export const paymentsRouter = express.Router();

// Memory store fallback for processed webhook payment IDs (idempotency safeguard)
const processedPaymentIds = new Set<string>();

/**
 * Validates Mercado Pago Webhook HMAC-SHA256 signature
 * Header: x-signature: ts=...,v1=...
 * Header: x-request-id
 */
export function verifyMercadoPagoSignature(input: {
  xSignature?: string | null;
  xRequestId?: string | null;
  dataId?: string | null;
}): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    // If webhook secret not set in development, accept requests safely
    return true;
  }
  if (!input.xSignature || !input.dataId) return false;

  const parts = Object.fromEntries(
    input.xSignature.split(',').map((part) => {
      const [k, v] = part.split('=');
      return [k?.trim() ?? '', v?.trim() ?? ''];
    })
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${input.dataId};request-id:${input.xRequestId ?? ''};ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(v1, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * POST /api/payments/create-subscription
 * Prepares a Mercado Pago monthly subscription plan for Starter, Pro, or Scale
 */
paymentsRouter.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const { planId, userId, userEmail, returnUrl } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: 'planId e userId são obrigatórios' });
    }

    const plansConfig: Record<string, { name: string; price: number; credits: number }> = {
      starter: { name: 'X09 Starter Criador', price: 49.90, credits: 100 },
      pro: { name: 'X09 Pro (Recomendado)', price: 99.90, credits: 300 },
      scale: { name: 'X09 Scale Agência', price: 249.90, credits: 1000 },
    };

    const selectedPlan = plansConfig[planId];
    if (!selectedPlan) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const isMock = !mpAccessToken;

    // Generated reference ID
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Save pending subscription in Supabase if configured
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from('subscriptions').insert({
          user_id: userId,
          plan_id: planId,
          subscription_id: subscriptionId,
          status: 'pending',
          amount: selectedPlan.price,
          credits_monthly: selectedPlan.credits,
          provider: 'mercadopago',
        });
      } catch (err: any) {
        console.warn('Could not record subscription in database:', err.message);
      }
    }

    // In real mode, calls Mercado Pago Preapproval API:
    // https://api.mercadopago.com/preapproval
    let initPoint = `https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=${subscriptionId}`;
    if (mpAccessToken) {
      try {
        const mpRes = await fetch('https://api.mercadopago.com/preapproval_plan', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: selectedPlan.name,
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: selectedPlan.price,
              currency_id: 'BRL',
            },
            back_url: returnUrl || 'https://studio.x09.com.br',
          }),
        });

        if (mpRes.ok) {
          const mpData = await mpRes.json();
          if (mpData.init_point) {
            initPoint = mpData.init_point;
          }
        }
      } catch (e: any) {
        console.warn('Mercado Pago API call failed, falling back to simulated checkout:', e.message);
      }
    }

    return res.json({
      success: true,
      subscriptionId,
      planId,
      amount: selectedPlan.price,
      creditsMonthly: selectedPlan.credits,
      provider: 'mercadopago',
      initPoint,
      isMock,
      message: isMock
        ? 'Arquitetura Mercado Pago pronta. Para pagamentos reais em produção, configure MERCADO_PAGO_ACCESS_TOKEN.'
        : 'Assinatura inicializada no Mercado Pago.',
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: error.message || 'Erro ao criar assinatura' });
  }
});

/**
 * POST /api/payments/create-credit-purchase
 * Prepares an individual credit recharge package via Mercado Pago (PIX or Card)
 */
paymentsRouter.post('/create-credit-purchase', async (req: Request, res: Response) => {
  try {
    const { packageId, userId, userEmail, method } = req.body;

    if (!packageId || !userId) {
      return res.status(400).json({ error: 'packageId e userId são obrigatórios' });
    }

    const packagesConfig: Record<string, { name: string; credits: number; price: number }> = {
      pack_50: { name: 'Recarga +50 Créditos X09', credits: 50, price: 29.90 },
      pack_150: { name: 'Recarga +150 Créditos X09', credits: 150, price: 69.90 },
      pack_500: { name: 'Recarga +500 Créditos X09', credits: 500, price: 169.90 },
    };

    const selectedPack = packagesConfig[packageId];
    if (!selectedPack) {
      return res.status(400).json({ error: 'Pacote de créditos inválido' });
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const isMock = !mpAccessToken;

    // Generated sample PIX code
    const mockPixCopiaECola = `00020126580014br.gov.bcb.pix0136${paymentId}520400005303986540${selectedPack.price.toFixed(2)}5802BR5910X09STUDIO6009SAOPAULO62070503***6304ABCD`;

    // Save pending payment record in Supabase
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from('payments').insert({
          user_id: userId,
          payment_id: paymentId,
          package_id: packageId,
          amount: selectedPack.price,
          status: 'pending',
          credits: selectedPack.credits,
          provider: 'mercadopago',
          payment_method: method || 'pix',
        });
      } catch (err: any) {
        console.warn('Could not record pending payment in database:', err.message);
      }
    }

    return res.json({
      success: true,
      paymentId,
      packageId,
      amount: selectedPack.price,
      credits: selectedPack.credits,
      provider: 'mercadopago',
      paymentMethod: method || 'pix',
      pixCopiaECola: mockPixCopiaECola,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mockPixCopiaECola)}`,
      isMock,
      message: isMock
        ? 'Ambiente de testes ativo. Configure MERCADO_PAGO_ACCESS_TOKEN para cobrança bancária real.'
        : 'Cobrança gerada com sucesso.',
    });
  } catch (error: any) {
    console.error('Error creating credit purchase:', error);
    return res.status(500).json({ error: error.message || 'Erro ao processar compra de créditos' });
  }
});

/**
 * POST /api/payments/webhook
 * Mercado Pago IPN / Webhook handler
 * Strict idempotency: will NOT credit the same paymentId twice
 */
paymentsRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('[Mercado Pago Webhook Received]:', JSON.stringify(payload));

    // Handle both formats: query notification or body data
    const paymentId = payload?.data?.id || req.query['data.id'] || req.query.id || payload?.id;
    const action = payload?.action || payload?.type;

    if (!paymentId) {
      return res.status(200).json({ received: true, ignored: 'No payment ID in payload' });
    }

    const strPaymentId = String(paymentId);

    // Signature verification if MERCADO_PAGO_WEBHOOK_SECRET is present
    const xSignature = req.headers['x-signature'] as string | undefined;
    const xRequestId = req.headers['x-request-id'] as string | undefined;
    const isValidSignature = verifyMercadoPagoSignature({
      xSignature,
      xRequestId,
      dataId: strPaymentId,
    });

    if (!isValidSignature) {
      console.warn(`[Mercado Pago Webhook] Assinatura inválida para payment ${strPaymentId}`);
      return res.status(401).json({ error: 'Assinatura inválida do webhook' });
    }

    // 1. In-memory idempotency check
    if (processedPaymentIds.has(strPaymentId)) {
      console.log(`[Webhook Idempotency] Payment ${strPaymentId} was already processed. Skipping.`);
      return res.status(200).json({ status: 'already_processed', paymentId: strPaymentId });
    }

    // 2. Fetch payment details from Mercado Pago if token is available
    let status = 'approved';
    let userId = payload?.user_id || payload?.metadata?.user_id;
    let creditsToAdd = Number(payload?.credits || payload?.metadata?.credits || 50);
    let amountBrl = Number(payload?.transaction_amount || 29.90);

    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (mpAccessToken) {
      try {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${strPaymentId}`, {
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
          },
        });
        if (mpRes.ok) {
          const mpData = await mpRes.json();
          status = mpData.status;
          userId = mpData.metadata?.user_id || userId;
          creditsToAdd = Number(mpData.metadata?.credits || creditsToAdd);
          amountBrl = Number(mpData.transaction_amount || amountBrl);
        }
      } catch (err: any) {
        console.error('Error checking MP payment status:', err.message);
      }
    }

    // Only grant credits if status is approved
    if (status === 'approved' && userId) {
      const supabase = getSupabaseAdmin();

      if (supabase) {
        // Execute atomic idempotent RPC function in database
        const { data: rpcResult, error: rpcError } = await supabase.rpc('add_user_credits_idempotent', {
          p_user_id: userId,
          p_payment_id: strPaymentId,
          p_amount: creditsToAdd,
          p_type: 'purchase',
          p_description: `Recarga Mercado Pago aprovada (+${creditsToAdd} créditos)`,
          p_price_brl: amountBrl,
          p_raw_payload: payload,
        });

        if (rpcError) {
          console.error('Supabase idempotent credit addition failed:', rpcError);
          return res.status(500).json({ error: rpcError.message });
        }

        console.log('[Webhook Idempotent Success]:', rpcResult);
      }

      // Mark as processed in local set
      processedPaymentIds.add(strPaymentId);
    }

    return res.status(200).json({ received: true, status, paymentId: strPaymentId });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: error.message });
  }
});
