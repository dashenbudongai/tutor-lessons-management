import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  email: 'tutor@example.com',
  name: 'Tony',
  role: 'tutor',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'tutor@example.com' && password === 'password') {
      setUser(mockUser);
      localStorage.setItem('tutor_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutor_user');
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('tutor_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}