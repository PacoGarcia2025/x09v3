import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Flame,
  Clock,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MERCADO_PAGO_PLANS, CREDIT_PACKAGES } from '../../data/mockX09';
import { MercadoPagoPlan, CreditPackage } from '../../types/x09';
import { X09Logo } from './X09Logo';

interface MercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'plans' | 'packages';
}

export const MercadoPagoModal: React.FC<MercadoPagoModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'plans',
}) => {
  const { user, addCredits, changePlan } = useAuth();
  const [tab, setTab] = useState<'plans' | 'packages'>(defaultTab);
  const [selectedPlan, setSelectedPlan] = useState<MercadoPagoPlan>(MERCADO_PAGO_PLANS[1]); // Pro by default
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(CREDIT_PACKAGES[1]); // 150 credits
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  if (!isOpen) return null;

  const currentPrice =
    tab === 'plans' ? selectedPlan.priceMonthly : selectedPackage.priceBrl;
  const currentCredits =
    tab === 'plans' ? selectedPlan.creditsMonthly : selectedPackage.credits;

  const pixPayload = `00020126580014br.gov.bcb.pix0136x09studio-mercadopago-${Date.now()}520400005303986540${currentPrice.toFixed(
    2
  )}5802BR5910X09 STUDIO6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (tab === 'plans') {
        const planName =
          selectedPlan.id === 'starter'
            ? 'Starter'
            : selectedPlan.id === 'pro'
            ? 'Pro'
            : 'Scale';
        changePlan(planName, selectedPlan.creditsMonthly);
        setPaymentSuccess(
          `Plano ${selectedPlan.name} ativado com sucesso! +${selectedPlan.creditsMonthly} créditos adicionados à sua conta.`
        );
      } else {
        addCredits(selectedPackage.credits);
        setPaymentSuccess(
          `Recarga concluída! +${selectedPackage.credits} créditos foram adicionados ao seu saldo.`
        );
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="relative p-5 sm:p-7 border-b border-zinc-800/80 bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-blue-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <X09Logo variant="circular" size="sm" withGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Mercado Pago Checkout • X09 Studio
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Seguro SSL 256-bit</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Escolha seu plano mensal ou compre créditos avulsos para criar projetos ilimitados com IA.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Pagamento Confirmado!</h3>
            <p className="text-sm text-zinc-300 max-w-md mb-6">{paymentSuccess}</p>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-6 w-full max-w-sm">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Saldo Atualizado:</span>
                <span className="font-mono text-purple-300 font-bold">
                  {user?.credits ?? 0} Créditos
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Plano Ativo:</span>
                <span className="font-bold text-white">{user?.plan ?? 'Pro'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentSuccess(null);
                onClose();
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              Voltar ao Studio & Criar
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Plan / Package Selection (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Tabs: Planos Mensais vs Recarga Avulsa */}
              <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold">
                <button
                  onClick={() => setTab('plans')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'plans'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Planos Mensais (Lovable / Base44)</span>
                </button>
                <button
                  onClick={() => setTab('packages')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'packages'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Créditos Avulsos</span>
                </button>
              </div>

              {/* Plans List */}
              {tab === 'plans' && (
                <div className="flex flex-col gap-3">
                  {MERCADO_PAGO_PLANS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-900/20'
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {plan.name}
                            </span>
                            {plan.badge && (
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  plan.popular
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-white">
                              R$ {plan.priceMonthly.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-[10px] text-zinc-400 block">/mês</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-purple-400" />
                            <span>{plan.creditsMonthly} créditos / mês</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-zinc-400">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 truncate">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Packages List */}
              {tab === 'packages' && (
                <div className="flex flex-col gap-3">
                  {CREDIT_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-900/20'
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {pkg.name}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                              {pkg.badge}
                            </span>
                          </div>
                          <span className="text-lg font-black text-white">
                            R$ {pkg.priceBrl.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-2">{pkg.description}</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                          <Zap className="w-3.5 h-3.5 text-purple-400" />
                          <span>+{pkg.credits} Créditos adicionados na hora</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* User Balance Info */}
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>Seu saldo atual:</span>
                  <span className="font-bold text-white font-mono">
                    {user?.credits ?? 0} créditos
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span>Após a compra:</span>
                  <span className="font-bold font-mono">
                    {(user?.credits ?? 0) + currentCredits} créditos
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Mercado Pago Payment Method (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Forma de Pagamento (Mercado Pago)</span>
                </h3>

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'pix'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>PIX Instantâneo</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === 'credit_card'
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>

                {/* PIX Option */}
                {paymentMethod === 'pix' && (
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl mb-3 shadow-md flex items-center justify-center">
                      {/* Dynamic SVG QR Code Representation */}
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                        fill="#000000"
                      >
                        <rect x="0" y="0" width="30" height="30" fill="#000000" />
                        <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                        <rect x="10" y="10" width="10" height="10" fill="#000000" />

                        <rect x="70" y="0" width="30" height="30" fill="#000000" />
                        <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                        <rect x="80" y="10" width="10" height="10" fill="#000000" />

                        <rect x="0" y="70" width="30" height="30" fill="#000000" />
                        <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                        <rect x="10" y="80" width="10" height="10" fill="#000000" />

                        <rect x="40" y="10" width="20" height="10" />
                        <rect x="35" y="35" width="30" height="30" />
                        <rect x="70" y="45" width="25" height="15" />
                        <rect x="45" y="75" width="45" height="15" />
                      </svg>
                    </div>

                    <div className="text-[11px] text-zinc-400 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>Aprovação imediata em até 5 segundos</span>
                    </div>

                    {/* Copia e Cola Button */}
                    <button
                      onClick={handleCopyPix}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5 mb-2"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Código PIX Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Chave PIX Copia e Cola</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Credit Card Option */}
                {paymentMethod === 'credit_card' && (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">
                        Nome Impresso no Cartão
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="NOME COMO ESTÁ NO CARTÃO"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500 uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">
                        Parcelamento
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="1">1x de R$ {currentPrice.toFixed(2).replace('.', ',')} (Sem juros)</option>
                        <option value="2">2x de R$ {(currentPrice / 2).toFixed(2).replace('.', ',')} (Sem juros)</option>
                        <option value="3">3x de R$ {(currentPrice / 3).toFixed(2).replace('.', ',')} (Sem juros)</option>
                        <option value="6">6x de R$ {(currentPrice / 6).toFixed(2).replace('.', ',')}</option>
                        <option value="12">12x de R$ {(currentPrice / 12).toFixed(2).replace('.', ',')}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Total & Confirmation Action */}
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-zinc-400">Total a pagar:</span>
                  <span className="text-xl font-black text-emerald-400">
                    R$ {currentPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processando no Mercado Pago...</span>
                  ) : paymentMethod === 'pix' ? (
                    <>
                      <span>Já realizei o PIX • Liberar Créditos</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Pagar com Cartão de Crédito</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-2 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-zinc-400" />
                  <span>Processado de forma segura via Mercado Pago Brasil</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
