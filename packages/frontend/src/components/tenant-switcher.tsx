'use client';

import { useAuth } from '@/contexts/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TenantSwitcher() {
  const { tenants, currentTenant, switchTenant } = useAuth();

  if (!tenants || tenants.length <= 1) return null;

  return (
    <Select value={currentTenant?.tenantId} onValueChange={switchTenant}>
      <SelectTrigger className="w-[180px] glass border-white/20 dark:border-slate-700/30">
        <SelectValue placeholder="Select company" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((tenant) => (
          <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
            {tenant.tenantName} ({tenant.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}