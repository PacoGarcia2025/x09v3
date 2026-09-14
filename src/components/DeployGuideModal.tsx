import { useState } from 'react';
import { HOSTINGER_STEPS } from '../data/stack';
import { X, Copy, Check, Terminal, ExternalLink, ShieldCheck, Server, AlertCircle } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeployGuideModal({ isOpen, onClose }: DeployGuideModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Guia de Deploy: AI Studio ➔ GitHub ➔ Hostinger VPS
              </h3>
              <p className="text-xs text-zinc-400">
                Passo a passo completo com comandos prontos para publicar o Studio x09 em produção.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informative banner */}
        <div className="border-b border-zinc-800 bg-cyan-950/20 px-6 py-3">
          <div className="flex items-center gap-3 text-xs text-cyan-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              <strong>Arquitetura 100% Autônoma:</strong> Sua aplicação é compilada em arquivos estáticos otimizados na pasta <code className="rounded bg-black/40 px-1 text-cyan-200 font-mono">dist/</code> e servida pelo Nginx com suporte total a HTTPS.
            </span>
          </div>
        </div>

        {/* Scrollable Steps Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {HOSTINGER_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 font-mono text-xs font-bold text-cyan-400">
                    {step.step}
                  </span>
                  <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">
                    {step.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleCopy(step.command, idx)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 active:scale-95 transition-all"
                  title="Copiar comandos"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {step.desc}
              </p>

              {/* Command box */}
              <div className="relative mt-3 rounded-lg border border-zinc-800 bg-black/90 p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{step.command}</pre>
              </div>
            </div>
          ))}

          {/* VPS Best Practices card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h5 className="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-300 uppercase">
              <Server className="h-4 w-4 text-cyan-400" />
              Dicas de Manutenção no Hostinger hPanel
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>• <strong>Firewall (UFW):</strong> Certifique-se de liberar as portas 80 (HTTP), 443 (HTTPS) e 22 (SSH) rodando <code className="rounded bg-black/40 px-1 text-zinc-200 font-mono">sudo ufw allow &apos;Nginx Full&apos; &amp;&amp; sudo ufw allow OpenSSH &amp;&amp; sudo ufw enable</code>.</li>
              <li>• <strong>Apontamento DNS:</strong> Na Hostinger ou no Registro.br, aponte os registros <strong>Tipo A</strong> com o nome <code className="rounded bg-black/40 px-1 text-zinc-200 font-mono">@</code> e <code className="rounded bg-black/40 px-1 text-zinc-200 font-mono">www</code> para o IP da sua VPS.</li>
              <li>• <strong>Export do AI Studio:</strong> O botão &quot;Export to GitHub&quot; fica sempre visível no menu superior da interface do AI Studio.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/80 px-6 py-4">
          <span className="text-xs text-zinc-400">
            Studio x09 • Blueprint de Produção
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-400"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
}
