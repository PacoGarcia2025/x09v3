import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserAccount,
  UserProject,
  IntegrationConfig,
  FitLifeState,
  X09Template,
  CreditTransaction,
  DEFAULT_CREDIT_ECONOMY,
  CreditEconomyConfig,
} from '../types/x09';
import { BLANK_PROJECT_DATA, X09_OFFICIAL_TEMPLATES } from '../data/mockX09';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  projects: UserProject[];
  activeProject: UserProject | null;
  integrations: IntegrationConfig;
  templates: X09Template[];
  creditEconomy: CreditEconomyConfig;
  creditTransactions: CreditTransaction[];
  supabaseActive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  setActiveProject: (project: UserProject | null) => void;
  createProject: (
    title: string,
    category: UserProject['category'],
    subdomain: string,
    templateData?: FitLifeState
  ) => Promise<UserProject | null>;
  cloneTemplate: (
    template: X09Template,
    customTitle: string,
    customSubdomain: string
  ) => Promise<UserProject | null>;
  updateProject: (id: string, partial: Partial<UserProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  checkSubdomainAvailable: (subdomain: string, excludeProjectId?: string) => boolean;
  updateIntegrations: (newConfig: Partial<IntegrationConfig>) => void;
  consumeCredits: (amount: number, reason: string, referenceId?: string) => Promise<boolean>;
  addCredits: (amount: number, description?: string) => Promise<void>;
  changePlan: (newPlan: UserAccount['plan'], newMonthlyCredits: number) => Promise<void>;
  refreshUserData: () => Promise<void>;
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
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [activeProject, setActiveProject] = useState<UserProject | null>(null);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [creditEconomy, setCreditEconomy] = useState<CreditEconomyConfig>(DEFAULT_CREDIT_ECONOMY);
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);

  const [integrations, setIntegrations] = useState<IntegrationConfig>(() => {
    try {
      const saved = localStorage.getItem('x09_integrations');
      return saved ? JSON.parse(saved) : DEFAULT_INTEGRATIONS;
    } catch {
      return DEFAULT_INTEGRATIONS;
    }
  });

  // Fetch dynamic credit economy from backend API
  useEffect(() => {
    fetch('/api/credits/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg) {
          setCreditEconomy({
            welcomeBonus: cfg.welcomeBonus ?? 15,
            projectCreationCost: cfg.projectCreationCost ?? 5,
            templateCloneCost: cfg.templateCloneCost ?? 5,
            aiCommandCost: cfg.aiCommandCost ?? 1,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch user projects from Supabase with strict RLS
  const loadUserProjects = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped: UserProject[] = data.map((row: any) => ({
            id: row.id,
            userId: row.owner_id,
            ownerId: row.owner_id,
            title: row.name,
            name: row.name,
            slug: row.slug,
            subdomain: row.subdomain,
            customDomain: row.custom_domain,
            category: row.category,
            status: row.status,
            templateId: row.template_id,
            views: row.views || 0,
            lastEdited: new Date(row.updated_at).toLocaleDateString('pt-BR'),
            thumbnail: row.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            data: row.data || BLANK_PROJECT_DATA,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
          setProjects(mapped);
          return mapped;
        }
      } catch (e) {
        console.warn('Supabase projects fetch error, fallback to local store:', e);
      }
    }

    // Local fallback: strictly isolated by userId
    try {
      const savedProjects = localStorage.getItem(`x09_projects_${userId}`);
      if (savedProjects) {
        const parsed: UserProject[] = JSON.parse(savedProjects);
        setProjects(parsed);
        return parsed;
      }
    } catch {
      // ignore
    }
    setProjects([]);
    return [];
  }, []);

  // Fetch user credit balance and transactions
  const loadUserCredits = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: bal } = await supabase
          .from('credit_balances')
          .select('balance, total_earned')
          .eq('user_id', userId)
          .single();

        if (bal) {
          setUser((prev) =>
            prev ? { ...prev, credits: bal.balance, creditsTotal: bal.total_earned } : null
          );
        }

        const { data: txs } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30);

        if (txs) {
          setCreditTransactions(
            txs.map((t: any) => ({
              id: t.id,
              userId: t.user_id,
              amount: t.amount,
              balanceBefore: t.balance_before,
              balanceAfter: t.balance_after,
              type: t.type,
              description: t.description,
              referenceId: t.reference_id,
              createdAt: t.created_at,
            }))
          );
        }
      } catch (err) {
        console.warn('Credits load error:', err);
      }
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user?.id) {
      await Promise.all([loadUserProjects(user.id), loadUserCredits(user.id)]);
    }
  }, [user?.id, loadUserProjects, loadUserCredits]);

  // Initialize Session: Supabase Auth or Local Session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      setIsLoading(true);
      const supabase = getSupabase();
      const configured = isSupabaseConfigured();
      setSupabaseActive(configured);

      if (configured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (!error && session?.user && mounted) {
            const authUser = session.user;
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();

            // Fetch balance
            const { data: balanceData } = await supabase
              .from('credit_balances')
              .select('balance, total_earned')
              .eq('user_id', authUser.id)
              .single();

            const isOwner = authUser.email?.toLowerCase() === 'sgoliveira16@gmail.com';
            const userObj: UserAccount = {
              id: authUser.id,
              name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Criador X09',
              email: authUser.email || '',
              role: profile?.role || (isOwner ? 'admin' : 'creator'),
              plan: profile?.plan || (isOwner ? 'Pro' : 'Free'),
              credits: balanceData?.balance ?? (isOwner ? 300 : 15),
              creditsTotal: balanceData?.total_earned ?? (isOwner ? 300 : 15),
              createdAt: authUser.created_at ? authUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              supabaseConnected: true,
            };

            setUser(userObj);
            await loadUserProjects(authUser.id);
            await loadUserCredits(authUser.id);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase session initialization error:', e);
        }
      }

      // Local storage fallback for standalone preview
      try {
        const saved = localStorage.getItem('x09_current_user');
        if (saved && mounted) {
          const parsedUser: UserAccount = JSON.parse(saved);
          setUser(parsedUser);
          await loadUserProjects(parsedUser.id);
        }
      } catch {
        // ignore
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes if active
    const supabase = getSupabase();
    let authSubscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = session.user;
          const isOwner = authUser.email?.toLowerCase() === 'sgoliveira16@gmail.com';
          const userObj: UserAccount = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Criador X09',
            email: authUser.email || '',
            role: isOwner ? 'admin' : 'creator',
            plan: isOwner ? 'Pro' : 'Free',
            credits: isOwner ? 300 : 15,
            creditsTotal: isOwner ? 300 : 15,
            createdAt: authUser.created_at ? authUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            supabaseConnected: true,
          };
          setUser(userObj);
          await loadUserProjects(authUser.id);
          await loadUserCredits(authUser.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProjects([]);
          setActiveProject(null);
        }
      });
      authSubscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [loadUserProjects, loadUserCredits]);

  // Sync projects to local cache for instant reload
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`x09_projects_${user.id}`, JSON.stringify(projects));
    }
  }, [projects, user?.id]);

  // Login method with Supabase Auth support
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    const cleanEmail = email.toLowerCase().trim();

    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const isOwner = cleanEmail === 'sgoliveira16@gmail.com';
          const userObj: UserAccount = {
            id: data.user.id,
            name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: isOwner ? 'admin' : 'creator',
            plan: isOwner ? 'Pro' : 'Free',
            credits: isOwner ? 300 : 15,
            creditsTotal: isOwner ? 300 : 15,
            createdAt: data.user.created_at ? data.user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            supabaseConnected: true,
          };
          setUser(userObj);
          await loadUserProjects(data.user.id);
          await loadUserCredits(data.user.id);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local authentication fallback
    const isOwner = cleanEmail === 'sgoliveira16@gmail.com';
    const localUser: UserAccount = {
      id: `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: isOwner ? 'admin' : 'creator',
      plan: isOwner ? 'Pro' : 'Free',
      credits: isOwner ? 300 : 15, // Starts with 15 free credits
      creditsTotal: isOwner ? 300 : 15,
      createdAt: new Date().toISOString().split('T')[0],
      supabaseConnected: isSupabaseConfigured(),
    };

    localStorage.setItem('x09_current_user', JSON.stringify(localUser));
    setUser(localUser);
    await loadUserProjects(localUser.id);
    return { success: true };
  };

  // Register method with Supabase Auth
  const register = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const supabase = getSupabase();

    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const userObj: UserAccount = {
            id: data.user.id,
            name: name || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: 'creator',
            plan: 'Free',
            credits: 15, // 15 free initial credits
            creditsTotal: 15,
            createdAt: new Date().toISOString().split('T')[0],
            supabaseConnected: true,
          };
          setUser(userObj);
          // New user starts with 0 projects
          setProjects([]);
          setActiveProject(null);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Fallback: new user starts with 0 projects
    const localUser: UserAccount = {
      id: `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      name: name.trim() || cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: 'creator',
      plan: 'Free',
      credits: 15, // 15 courtesy credits
      creditsTotal: 15,
      createdAt: new Date().toISOString().split('T')[0],
      supabaseConnected: isSupabaseConfigured(),
    };

    localStorage.setItem('x09_current_user', JSON.stringify(localUser));
    setUser(localUser);
    setProjects([]); // Starts empty!
    setActiveProject(null);
    return { success: true };
  };

  // Password reset via Supabase
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
    return { success: true };
  };

  // Logout
  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase logout error:', err);
      }
    }
    localStorage.removeItem('x09_current_user');
    localStorage.removeItem('x09_active_project_id');
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    setCreditTransactions([]);
  };

  // Atomic credit consumption
  const consumeCredits = async (amount: number, reason: string, referenceId?: string): Promise<boolean> => {
    if (!user) return false;
    if (user.credits < amount) {
      return false; // Insufficient credits
    }

    try {
      // Call backend atomic endpoint
      const response = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          type: reason.includes('Criação')
            ? 'project_creation'
            : reason.includes('Clonagem')
            ? 'template_clone'
            : 'generation',
          description: reason,
          referenceId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newBalance = result.balance_after ?? Math.max(0, user.credits - amount);

        setUser((prev) => (prev ? { ...prev, credits: newBalance } : null));

        // Add to client ledger
        const newTx: CreditTransaction = {
          id: result.transaction_id || `tx_${Date.now()}`,
          userId: user.id,
          amount: -amount,
          balanceBefore: user.credits,
          balanceAfter: newBalance,
          type: 'generation',
          description: reason,
          referenceId,
          createdAt: new Date().toISOString(),
        };
        setCreditTransactions((prev) => [newTx, ...prev]);
        return true;
      }
    } catch (err) {
      console.warn('Backend credit deduction failed, updating local state:', err);
    }

    // Local deduction fallback
    const newBal = Math.max(0, user.credits - amount);
    setUser((prev) => (prev ? { ...prev, credits: newBal } : null));
    return true;
  };

  // Add credits
  const addCredits = async (amount: number, description?: string) => {
    if (!user) return;
    const newCredits = user.credits + amount;
    const newTotal = user.creditsTotal + amount;

    setUser((prev) =>
      prev ? { ...prev, credits: newCredits, creditsTotal: newTotal } : null
    );

    const newTx: CreditTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      amount,
      balanceBefore: user.credits,
      balanceAfter: newCredits,
      type: 'purchase',
      description: description || `Recarga de +${amount} créditos`,
      createdAt: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [newTx, ...prev]);
  };

  // Change Plan
  const changePlan = async (newPlan: UserAccount['plan'], newMonthlyCredits: number) => {
    if (!user) return;
    const newCredits = user.credits + newMonthlyCredits;
    const newTotal = user.creditsTotal + newMonthlyCredits;

    setUser((prev) =>
      prev ? { ...prev, plan: newPlan, credits: newCredits, creditsTotal: newTotal } : null
    );
  };

  // Check Subdomain Availability
  const checkSubdomainAvailable = (subdomain: string, excludeProjectId?: string): boolean => {
    const clean = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean || clean.length < 3) return false;
    const reserved = ['studio', 'api', 'admin', 'auth', 'mail', 'www', 'ftp', 'ssh', 'db', 'app'];
    if (reserved.includes(clean)) return false;

    const conflict = projects.find(
      (p) => p.subdomain.toLowerCase() === clean && p.id !== excludeProjectId
    );
    return !conflict;
  };

  // Create Project: starts 100% BLANK, costs 5 credits
  const createProject = async (
    title: string,
    category: UserProject['category'],
    subdomain: string,
    templateData?: FitLifeState
  ): Promise<UserProject | null> => {
    if (!user) return null;

    const cost = creditEconomy.projectCreationCost;
    if (user.credits < cost) {
      return null;
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `proj-${Date.now()}`;
    const projectData = templateData || {
      ...BLANK_PROJECT_DATA,
      name: title.trim() || 'Meu Projeto',
      slogan: category,
      headline: `${title.toUpperCase()} • TELA EM BRANCO`,
      subheadline: 'Construído do zero no X09 Studio através de conversação com inteligência artificial.',
    };

    const supabase = getSupabase();
    let createdProject: UserProject;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            owner_id: user.id,
            name: title.trim() || 'Novo Projeto',
            slug: cleanSubdomain,
            subdomain: cleanSubdomain,
            category,
            status: 'draft',
            views: 0,
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            data: projectData,
          })
          .select()
          .single();

        if (!error && data) {
          createdProject = {
            id: data.id,
            userId: user.id,
            ownerId: user.id,
            title: data.name,
            name: data.name,
            slug: data.slug,
            subdomain: data.subdomain,
            category: data.category,
            status: data.status,
            views: 0,
            lastEdited: 'Agora mesmo',
            thumbnail: data.thumbnail,
            data: data.data,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          await consumeCredits(cost, `Criação do projeto ${title}`, createdProject.id);
          setProjects((prev) => [createdProject, ...prev]);
          setActiveProject(createdProject);
          return createdProject;
        }
      } catch (err) {
        console.warn('Supabase project creation failed, creating locally:', err);
      }
    }

    // Local creation
    createdProject = {
      id: `proj_${Date.now()}`,
      userId: user.id,
      ownerId: user.id,
      title: title.trim() || 'Novo Projeto',
      slug: cleanSubdomain,
      subdomain: cleanSubdomain,
      category,
      status: 'draft',
      views: 0,
      lastEdited: 'Agora mesmo',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      data: projectData,
    };

    await consumeCredits(cost, `Criação do projeto ${title}`, createdProject.id);
    setProjects((prev) => [createdProject, ...prev]);
    setActiveProject(createdProject);
    return createdProject;
  };

  // Clone Template: creates copy with new project_id, owner_id = current user, costs 5 credits
  const cloneTemplate = async (
    template: X09Template,
    customTitle: string,
    customSubdomain: string
  ): Promise<UserProject | null> => {
    if (!user) return null;

    const cost = creditEconomy.templateCloneCost;
    if (user.credits < cost) {
      return null;
    }

    const cleanSubdomain =
      customSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') ||
      `${template.suggestedSubdomain}-${Date.now().toString().slice(-4)}`;

    const projectData = {
      ...template.data,
      name: customTitle.trim() || template.data.name,
    };

    const supabase = getSupabase();
    let clonedProject: UserProject;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            owner_id: user.id,
            name: customTitle.trim() || template.title,
            slug: cleanSubdomain,
            subdomain: cleanSubdomain,
            category: template.category,
            status: 'draft',
            template_id: template.id,
            views: 0,
            thumbnail: template.thumbnail,
            data: projectData,
          })
          .select()
          .single();

        if (!error && data) {
          clonedProject = {
            id: data.id,
            userId: user.id,
            ownerId: user.id,
            title: data.name,
            name: data.name,
            slug: data.slug,
            subdomain: data.subdomain,
            category: data.category,
            status: data.status,
            templateId: template.id,
            views: 0,
            lastEdited: 'Agora mesmo',
            thumbnail: data.thumbnail,
            data: data.data,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          await consumeCredits(cost, `Clonagem do modelo ${template.title}`, clonedProject.id);
          setProjects((prev) => [clonedProject, ...prev]);
          setActiveProject(clonedProject);
          return clonedProject;
        }
      } catch (err) {
        console.warn('Supabase template clone failed, cloning locally:', err);
      }
    }

    // Local clone
    clonedProject = {
      id: `proj_${Date.now()}`,
      userId: user.id,
      ownerId: user.id,
      title: customTitle.trim() || template.title,
      slug: cleanSubdomain,
      subdomain: cleanSubdomain,
      category: template.category,
      status: 'draft',
      templateId: template.id,
      views: 0,
      lastEdited: 'Agora mesmo',
      thumbnail: template.thumbnail,
      data: projectData,
    };

    await consumeCredits(cost, `Clonagem do modelo ${template.title}`, clonedProject.id);
    setProjects((prev) => [clonedProject, ...prev]);
    setActiveProject(clonedProject);
    return clonedProject;
  };

  // Update Project in Supabase / Local
  const updateProject = async (id: string, partial: Partial<UserProject>) => {
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

    const supabase = getSupabase();
    if (supabase && user) {
      try {
        const updatePayload: any = { updated_at: new Date().toISOString() };
        if (partial.title) updatePayload.name = partial.title;
        if (partial.data) updatePayload.data = partial.data;
        if (partial.status) updatePayload.status = partial.status;
        if (partial.customDomain) updatePayload.custom_domain = partial.customDomain;

        await supabase
          .from('projects')
          .update(updatePayload)
          .eq('id', id)
          .eq('owner_id', user.id); // Strict RLS
      } catch (err) {
        console.warn('Supabase project update failed:', err);
      }
    }
  };

  // Delete Project with RLS
  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProject(remaining[0] || null);
    }

    const supabase = getSupabase();
    if (supabase && user) {
      try {
        await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('owner_id', user.id); // Strict RLS
      } catch (err) {
        console.warn('Supabase project deletion failed:', err);
      }
    }
  };

  const updateIntegrations = (newConfig: Partial<IntegrationConfig>) => {
    setIntegrations((prev) => ({ ...prev, ...newConfig }));
    if (newConfig.supabaseUrl) {
      localStorage.setItem('x09_supabase_url', newConfig.supabaseUrl);
    }
    if (newConfig.supabaseAnonKey) {
      localStorage.setItem('x09_supabase_anon_key', newConfig.supabaseAnonKey);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        projects,
        activeProject,
        integrations,
        templates: X09_OFFICIAL_TEMPLATES,
        creditEconomy,
        creditTransactions,
        supabaseActive,
        login,
        logout,
        register,
        resetPassword,
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
        refreshUserData,
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
