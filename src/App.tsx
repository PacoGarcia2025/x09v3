import { useState } from 'react';
import { X09Landing } from './components/x09/X09Landing';
import { X09Studio } from './components/x09/X09Studio';
import { PublishModal } from './components/x09/PublishModal';
import { Sparkles, Monitor, Layout, Terminal } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#060809] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-500/30 selection:text-purple-200">
      {/* Floating Mode Switcher for ease of testing between Landing and Studio Workspace */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/80 rounded-full p-1 shadow-2xl flex items-center gap-1 text-xs">
        <button
          onClick={() => setCurrentView('landing')}
          className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'landing'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Landing Page (Ref 1)</span>
        </button>

        <button
          onClick={() => setCurrentView('studio')}
          className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'studio'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>X09 Studio (Ref 2)</span>
        </button>

        <div className="w-px h-4 bg-zinc-800 mx-1"></div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors flex items-center gap-1"
          title="Ver comandos de Deploy Hostinger VPS & GitHub"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hostinger VPS / Git</span>
        </button>
      </div>

      {/* Main View Render */}
      {currentView === 'landing' ? (
        <X09Landing
          onOpenStudio={() => setCurrentView('studio')}
          onOpenDeployGuide={() => setIsPublishModalOpen(true)}
        />
      ) : (
        <X09Studio
          onBackToLanding={() => setCurrentView('landing')}
          onOpenPublish={() => setIsPublishModalOpen(true)}
        />
      )}

      {/* Publication & Hostinger VPS Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        projectName="Studio x09"
      />
    </div>
  );
}
