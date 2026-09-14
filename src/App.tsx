import { useState } from 'react';
import { X09Landing } from './components/x09/X09Landing';
import { X09Studio } from './components/x09/X09Studio';
import { UserDashboard } from './components/x09/UserDashboard';
import { PublishModal } from './components/x09/PublishModal';
import { AuthModal } from './components/x09/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sparkles, Layout, Terminal, FolderKanban, Globe, Shield, User } from 'lucide-react';
import { UserProject } from './types/x09';

function MainAppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('dashboard');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { setActiveProject, activeProject, user } = useAuth();

  const handleOpenStudio = (proj?: UserProject) => {
    if (proj) {
      setActiveProject(proj);
    }
    setCurrentView('studio');
  };

  return (
    <div className="min-h-screen bg-[#060809] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-500/30 selection:text-purple-200">
      {/* Floating Mode Switcher for seamless navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/80 rounded-full p-1 shadow-2xl flex items-center gap-1 text-xs max-w-[95vw] overflow-x-auto">
        <button
          onClick={() => setCurrentView('landing')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
            currentView === 'landing'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Landing (x09.com.br)</span>
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5 text-purple-300" />
          <span>Painel (studio.x09)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </button>

        <button
          onClick={() => setCurrentView('studio')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
            currentView === 'studio'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Editor Studio</span>
        </button>

        <div className="w-px h-4 bg-zinc-800 mx-1 shrink-0"></div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors flex items-center gap-1 shrink-0"
          title="Ver subdomínios, VPS Hostinger, Cloudflare e Supabase"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">VPS / Subdomínio</span>
        </button>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          title="Perfil / Login"
        >
          <User className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main View Render */}
      {currentView === 'landing' && (
        <X09Landing
          onOpenStudio={() => handleOpenStudio()}
          onOpenDeployGuide={() => setIsPublishModalOpen(true)}
          onOpenDashboard={() => setCurrentView('dashboard')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentView === 'dashboard' && (
        <UserDashboard
          onOpenStudio={(proj) => handleOpenStudio(proj)}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentView === 'studio' && (
        <X09Studio
          onBackToLanding={() => setCurrentView('landing')}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onOpenPublish={() => setIsPublishModalOpen(true)}
        />
      )}

      {/* Publication & Hostinger VPS Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        projectName={activeProject?.title || 'Studio x09'}
      />

      {/* Authentication & Supabase Connection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
