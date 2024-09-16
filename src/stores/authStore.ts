import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { users } from '../api/api';  // Import the users API

export interface User {
  name: string;
  email: string;
  id: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  registeredUsers: User[];
  login: (user: User, token: string) => void;
  logout: () => void;
  fetchRegisteredUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      registeredUsers: [],
      login: (user, token) => {
        set({ isAuthenticated: true, user, token });
      },
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      fetchRegisteredUsers: async () => {
        try {
          const fetchedUsers = await users.getAll();
          set({ registeredUsers: fetchedUsers });
        } catch (error) {
          console.error('Failed to fetch registered users:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        // We don't persist registeredUsers to avoid storing potentially sensitive data
      }),
    }
  )
);
