import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserProject, IntegrationConfig, FitLifeState } from '../types/x09';
import { INITIAL_FITLIFE_DATA } from '../data/mockX09';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  projects: UserProject[];
  activeProject: UserProject | null;
  integrations: IntegrationConfig;
  login: (email: string, name?: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  setActiveProject: (project: UserProject | null) => void;
  createProject: (title: string, category: UserProject['category'], subdomain: string, templateData?: FitLifeState) => UserProject;
  updateProject: (id: string, partial: Partial<UserProject>) => void;
  deleteProject: (id: string) => void;
  checkSubdomainAvailable: (subdomain: string, excludeProjectId?: string) => boolean;
  updateIntegrations: (newConfig: Partial<IntegrationConfig>) => void;
}

const DEFAULT_USER: UserAccount = {
  id: 'usr_sg_09',
  name: 'Sérgio Garcia',
  email: 'sgoliveira16@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  plan: 'Pro',
  createdAt: '2025-01-10',
  supabaseConnected: true,
};

const INITIAL_PROJECTS: UserProject[] = [
  {
    id: 'proj_fitlife_01',
    userId: 'usr_sg_09',
    title: 'FitLife – Academia Premium',
    slug: 'fitlife',
    subdomain: 'fitlife',
    customDomain: 'fitlifeacademia.com.br',
    category: 'Sites',
    status: 'published',
    views: 3420,
    lastEdited: 'Hoje às 18:45',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    data: INITIAL_FITLIFE_DATA,
  },
  {
    id: 'proj_nexus_02',
    userId: 'usr_sg_09',
    title: 'Nexus – Dashboard Financeiro',
    slug: 'nexus',
    subdomain: 'nexus',
    category: 'SaaS',
    status: 'published',
    views: 1850,
    lastEdited: 'Ontem às 14:20',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    data: {
      ...INITIAL_FITLIFE_DATA,
      name: 'Nexus SaaS',
      slogan: 'Gestão Financeira com IA',
      headline: 'CONTROLE FINANCEIRO EM TEMPO REAL',
      subheadline: 'Automatize cobranças, conciliação e relatórios com inteligência nativa.',
      accentColor: '#38bdf8',
    },
  },
  {
    id: 'proj_barber_03',
    userId: 'usr_sg_09',
    title: 'Barber King Club',
    slug: 'barberking',
    subdomain: 'barberking',
    category: 'Sites',
    status: 'draft',
    views: 420,
    lastEdited: 'Há 3 dias',
    thumbnail: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    data: {
      ...INITIAL_FITLIFE_DATA,
      name: 'Barber King',
      slogan: 'Cortes & Barba Clássica',
      headline: 'TRADIÇÃO & ESTILO PARA O HOMEM MODERNO',
      subheadline: 'Agende seu horário online sem espera com os melhores barbeiros da cidade.',
      accentColor: '#eab308',
    },
  },
];

const DEFAULT_INTEGRATIONS: IntegrationConfig = {
  supabaseUrl: 'https://xyzproject.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  cloudflareZoneId: 'cf_zone_x09_com_br',
  hostingerVpsIp: '194.163.155.88',
  domainBase: 'x09.com.br',
  studioSubdomain: 'studio.x09.com.br',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('x09_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [projects, setProjects] = useState<UserProject[]>(() => {
    const saved = localStorage.getItem('x09_user_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState<UserProject | null>(() => {
    const savedId = localStorage.getItem('x09_active_project_id');
    const list = projects.length > 0 ? projects : INITIAL_PROJECTS;
    return list.find((p) => p.id === savedId) || list[0];
  });

  const [integrations, setIntegrations] = useState<IntegrationConfig>(() => {
    const saved = localStorage.getItem('x09_integrations');
    return saved ? JSON.parse(saved) : DEFAULT_INTEGRATIONS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('x09_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('x09_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('x09_user_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('x09_active_project_id', activeProject.id);
    }
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem('x09_integrations', JSON.stringify(integrations));
  }, [integrations]);

  const login = (email: string, name?: string) => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: name || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Usuário X09'),
      email,
      role: 'creator',
      plan: 'Pro',
      createdAt: new Date().toISOString().split('T')[0],
      supabaseConnected: true,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name: string, email: string) => {
    login(email, name);
  };

  const checkSubdomainAvailable = (subdomain: string, excludeProjectId?: string): boolean => {
    const clean = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean || clean.length < 3) return false;
    // Reserved studio/system subdomains
    if (['studio', 'api', 'admin', 'auth', 'mail', 'www', 'ftp', 'ssh'].includes(clean)) {
      return false;
    }
    const conflict = projects.find(
      (p) => p.subdomain.toLowerCase() === clean && p.id !== excludeProjectId
    );
    return !conflict;
  };

  const createProject = (
    title: string,
    category: UserProject['category'],
    subdomain: string,
    templateData?: FitLifeState
  ): UserProject => {
    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `proj-${Date.now()}`;
    const newProj: UserProject = {
      id: `proj_${Date.now()}`,
      userId: user?.id || 'usr_guest',
      title,
      slug: cleanSubdomain,
      subdomain: cleanSubdomain,
      category,
      status: 'building',
      views: 0,
      lastEdited: 'Agora mesmo',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      data: templateData || {
        ...INITIAL_FITLIFE_DATA,
        name: title,
        slogan: category,
        headline: `${title.toUpperCase()} • NOVO PROJETO`,
        subheadline: 'Criado na plataforma X09 Studio com inteligência artificial.',
      },
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    return newProj;
  };

  const updateProject = (id: string, partial: Partial<UserProject>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...partial, lastEdited: 'Agora mesmo' };
          if (activeProject?.id === id) {
            setActiveProject(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProject(remaining[0] || null);
    }
  };

  const updateIntegrations = (newConfig: Partial<IntegrationConfig>) => {
    setIntegrations((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        projects,
        activeProject,
        integrations,
        login,
        logout,
        register,
        setActiveProject,
        createProject,
        updateProject,
        deleteProject,
        checkSubdomainAvailable,
        updateIntegrations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
