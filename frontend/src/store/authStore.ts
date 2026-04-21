import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'resident' | 'serviceProvider' | 'admin';
  token: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('homenexus_user') || 'null'),
  login: (user) => {
    localStorage.setItem('homenexus_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('homenexus_user');
    set({ user: null });
  },
  updateUser: (data) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...data };
      localStorage.setItem('homenexus_user', JSON.stringify(updated));
      return { user: updated };
    });
  },
}));
