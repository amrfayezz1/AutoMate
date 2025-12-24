import { create } from 'zustand';
import { supabase, signOut as supabaseSignOut } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setSession: (session) => set({ 
    session, 
    user: session?.user || null,
    isAuthenticated: !!session 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),

  signOut: async () => {
    set({ isLoading: true });
    await supabaseSignOut();
    set({ 
      user: null, 
      session: null, 
      isAuthenticated: false,
      isLoading: false 
    });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ 
          session, 
          user: session.user, 
          isAuthenticated: true 
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
