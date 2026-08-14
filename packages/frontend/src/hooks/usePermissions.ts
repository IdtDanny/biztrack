import { useAuth } from '@/contexts/auth-context';

export function usePermissions() {
  const { currentTenant } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!currentTenant) return false;
    const perms = currentTenant.permissions || [];
    return perms.includes(permission) || perms.includes('*');
  };

  return { hasPermission };
}