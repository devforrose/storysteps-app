
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, CEFRLevel } from '@/types';

interface UserContextType {
  user: User;
  updateLevel: (level: CEFRLevel) => void;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
  id: 'user-1',
  name: 'Learner',
  nativeLanguage: 'Spanish',
  targetLanguage: 'English',
  currentLevel: 'A2',
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const updateLevel = useCallback((level: CEFRLevel) => {
    setUser(prev => ({ ...prev, currentLevel: level, lastActiveAt: new Date().toISOString() }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates, lastActiveAt: new Date().toISOString() }));
  }, []);

  return (
    <UserContext.Provider value={{ user, updateLevel, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
