import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserProject, IntegrationConfig, FitLifeState, X09Template } from '../types/x09';
import { BLANK_PROJECT_DATA, X09_OFFICIAL_TEMPLATES } from '../data/mockX09';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  projects: UserProject[];
  activeProject: UserProject | null;
  integrations: IntegrationConfig;
  templates: X09Template[];
  login: (email: string, name?: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  setActiveProject: (project: UserProject | null) => void;
  createProject: (
    title: string,
    category: UserProject['category'],
    subdomain: string,
    templateData?: FitLifeState
  ) => UserProject | null;
  cloneTemplate: (
    template: X09Template,
    customTitle: string,
    customSubdomain: string
  ) => UserProject | null;
  updateProject: (id: string, partial: Partial<UserProject>) => void;
  deleteProject: (id: string) => void;
  checkSubdomainAvailable: (subdomain: string, excludeProjectId?: string) => boolean;
  updateIntegrations: (newConfig: Partial<IntegrationConfig>) => void;
  consumeCredits: (amount: number, reason: string) => boolean;
  addCredits: (amount: number) => void;
  changePlan: (newPlan: UserAccount['plan'], newMonthlyCredits: number) => void;
}

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
  // 1. User state starts as null unless explicitly logged in in localStorage
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('x09_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. User projects: starts completely empty [] for new users!
  const [projects, setProjects] = useState<UserProject[]>(() => {
    try {
      const savedUser = localStorage.getItem('x09_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const userSavedProjects = localStorage.getItem(`x09_projects_${u.id}`);
        return userSavedProjects ? JSON.parse(userSavedProjects) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activeProject, setActiveProject] = useState<UserProject | null>(() => {
    try {
      const savedId = localStorage.getItem('x09_active_project_id');
      if (!savedId) return null;
      return projects.find((p) => p.id === savedId) || null;
    } catch {
      return null;
    }
  });

  const [integrations, setIntegrations] = useState<IntegrationConfig>(() => {
    try {
      const saved = localStorage.getItem('x09_integrations');
      return saved ? JSON.parse(saved) : DEFAULT_INTEGRATIONS;
    } catch {
      return DEFAULT_INTEGRATIONS;
    }
  });

  // Synchronize user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('x09_current_user', JSON.stringify(user));
      // Load this user's projects
      const savedProjects = localStorage.getItem(`x09_projects_${user.id}`);
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          setProjects(parsed);
          if (parsed.length > 0 && !activeProject) {
            setActiveProject(parsed[0]);
          }
        } catch {
          setProjects([]);
        }
      } else {
        // Brand new user starts with 0 projects!
        setProjects([]);
      }
    } else {
      localStorage.removeItem('x09_current_user');
      setProjects([]);
      setActiveProject(null);
    }
  }, [user?.id]);

  // Synchronize projects to user-specific localStorage key
  useEffect(() => {
    if (user) {
      localStorage.setItem(`x09_projects_${user.id}`, JSON.stringify(projects));
    }
  }, [projects, user?.id]);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('x09_active_project_id', activeProject.id);
    } else {
      localStorage.removeItem('x09_active_project_id');
    }
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem('x09_integrations', JSON.stringify(integrations));
  }, [integrations]);

  const login = (email: string, name?: string) => {
    const existingRaw = localStorage.getItem(`x09_user_profile_${email}`);
    let existingProfile: UserAccount | null = null;
    if (existingRaw) {
      try {
        existingProfile = JSON.parse(existingRaw);
      } catch {
        existingProfile = null;
      }
    }

    if (existingProfile) {
      setUser(existingProfile);
    } else {
      const isOwner = email.toLowerCase() === 'sgoliveira16@gmail.com';
      const newUser: UserAccount = {
        id: `usr_${Date.now()}`,
        name: name || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Criador X09'),
        email,
        role: isOwner ? 'admin' : 'creator',
        plan: isOwner ? 'Pro' : 'Free',
        credits: isOwner ? 300 : 15, // 15 free credits for new users
        creditsTotal: isOwner ? 300 : 15,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
      };
      localStorage.setItem(`x09_user_profile_${email}`, JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
    setProjects([]);
    setActiveProject(null);
  };

  const register = (name: string, email: string) => {
    login(email, name);
  };

  const consumeCredits = (amount: number, reason: string): boolean => {
    if (!user) return false;
    if (user.credits < amount) {
      return false; // Insufficient credits
    }
    const updatedUser: UserAccount = {
      ...user,
      credits: Math.max(0, user.credits - amount),
    };
    setUser(updatedUser);
    localStorage.setItem(`x09_user_profile_${user.email}`, JSON.stringify(updatedUser));
    return true;
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updatedUser: UserAccount = {
      ...user,
      credits: user.credits + amount,
      creditsTotal: user.creditsTotal + amount,
    };
    setUser(updatedUser);
    localStorage.setItem(`x09_user_profile_${user.email}`, JSON.stringify(updatedUser));
  };

  const changePlan = (newPlan: UserAccount['plan'], newMonthlyCredits: number) => {
    if (!user) return;
    const updatedUser: UserAccount = {
      ...user,
      plan: newPlan,
      credits: user.credits + newMonthlyCredits,
      creditsTotal: user.creditsTotal + newMonthlyCredits,
    };
    setUser(updatedUser);
    localStorage.setItem(`x09_user_profile_${user.email}`, JSON.stringify(updatedUser));
  };

  const checkSubdomainAvailable = (subdomain: string, excludeProjectId?: string): boolean => {
    const clean = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean || clean.length < 3) return false;
    // Reserved studio/system subdomains
    if (['studio', 'api', 'admin', 'auth', 'mail', 'www', 'ftp', 'ssh', 'db', 'app'].includes(clean)) {
      return false;
    }
    const conflict = projects.find(
      (p) => p.subdomain.toLowerCase() === clean && p.id !== excludeProjectId
    );
    return !conflict;
  };

  // 3. Create Project - starts completely BLANK by default (no gym texts!)
  const createProject = (
    title: string,
    category: UserProject['category'],
    subdomain: string,
    templateData?: FitLifeState
  ): UserProject | null => {
    if (!user) return null;

    // Check credits: creating a project consumes 5 credits
    if (user.credits < 5) {
      return null;
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `proj-${Date.now()}`;
    const newProj: UserProject = {
      id: `proj_${Date.now()}`,
      userId: user.id,
      title: title.trim() || 'Novo Projeto',
      slug: cleanSubdomain,
      subdomain: cleanSubdomain,
      category,
      status: 'building',
      views: 0,
      lastEdited: 'Agora mesmo',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      // Starts 100% blank if no template data is provided!
      data: templateData || {
        ...BLANK_PROJECT_DATA,
        name: title.trim() || 'Meu Projeto',
        slogan: category,
        headline: `${title.toUpperCase()} • TELA EM BRANCO`,
        subheadline: 'Construído do zero no X09 Studio através de conversação com inteligência artificial.',
      },
    };

    consumeCredits(5, `Criação do projeto ${title}`);
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    return newProj;
  };

  // 4. Clone an official X09 Studio Template
  const cloneTemplate = (
    template: X09Template,
    customTitle: string,
    customSubdomain: string
  ): UserProject | null => {
    if (!user) return null;
    if (user.credits < 5) {
      return null;
    }

    const cleanSubdomain = customSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `${template.suggestedSubdomain}-${Date.now().toString().slice(-4)}`;
    const newProj: UserProject = {
      id: `proj_${Date.now()}`,
      userId: user.id,
      title: customTitle.trim() || template.title,
      slug: cleanSubdomain,
      subdomain: cleanSubdomain,
      category: template.category,
      status: 'draft',
      views: 0,
      lastEdited: 'Agora mesmo',
      thumbnail: template.thumbnail,
      data: {
        ...template.data,
        name: customTitle.trim() || template.data.name,
      },
    };

    consumeCredits(5, `Clonagem do modelo ${template.title}`);
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
        templates: X09_OFFICIAL_TEMPLATES,
        login,
        logout,
        register,
        setActiveProject,
        createProject,
        cloneTemplate,
        updateProject,
        deleteProject,
        checkSubdomainAvailable,
        updateIntegrations,
        consumeCredits,
        addCredits,
        changePlan,
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
