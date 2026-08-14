'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

type Tenant = {
  tenantId: string;
  tenantName: string;
  role: string;
  permissions: string[];
};

type AuthContextType = {
  user: any | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  setAuth: (data: { user: any; tenants: Tenant[]; currentTenantId: string }) => void;
  switchTenant: (tenantId: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTenants = localStorage.getItem('tenants');
    const storedTenantId = localStorage.getItem('currentTenantId');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedTenants) {
      const parsed = JSON.parse(storedTenants);
      setTenants(parsed);
      if (storedTenantId) {
        const found = parsed.find((t: Tenant) => t.tenantId === storedTenantId);
        if (found) setCurrentTenant(found);
        else if (parsed.length > 0) setCurrentTenant(parsed[0]);
      } else if (parsed.length > 0) {
        setCurrentTenant(parsed[0]);
      }
    }
  }, []);

  const setAuth = (data: { user: any; tenants: Tenant[]; currentTenantId: string }) => {
    setUser(data.user);
    setTenants(data.tenants);
    const found = data.tenants.find((t) => t.tenantId === data.currentTenantId);
    const selected = found || data.tenants[0];
    setCurrentTenant(selected);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tenants', JSON.stringify(data.tenants));
    localStorage.setItem('currentTenantId', selected.tenantId);
  };

  const switchTenant = async (tenantId: string) => {
    try {
      const res = await apiClient.post('/auth/switch-tenant', { tenantId });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('currentTenantId', tenantId);
      const found = tenants.find((t) => t.tenantId === tenantId);
      if (found) setCurrentTenant(found);
      router.refresh();
    } catch (error) {
      console.error('Failed to switch tenant', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenants');
    localStorage.removeItem('currentTenantId');
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, tenants, currentTenant, setAuth, switchTenant, logout }}>
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