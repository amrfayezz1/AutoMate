import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

interface AuthStore {
  status: AuthStatus;
  session: Session | null;
  pendingEmail: string | null;
  setSession: (session: Session | null) => void;
  setPendingEmail: (email: string | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'loading',
  session: null,
  pendingEmail: null,
  setSession: (session) =>
    set({ session, status: session ? 'authenticated' : 'unauthenticated' }),
  setPendingEmail: (pendingEmail) => set({ pendingEmail }),
  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      status: data.session ? 'authenticated' : 'unauthenticated',
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        status: session ? 'authenticated' : 'unauthenticated',
      });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, status: 'unauthenticated' });
  },
}));
