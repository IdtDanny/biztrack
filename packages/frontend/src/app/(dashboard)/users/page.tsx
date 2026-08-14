'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/usePermissions';
import apiClient from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const { currentTenant } = useAuth();
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      fetchUsers();
      fetchRoles();
    }
  }, [currentTenant]);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get('/roles'); // We need to add /roles endpoint or fetch from seed
      setRoles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      await apiClient.post(`/users/${userId}/role`, { roleId });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (confirm('Remove this user from the tenant?')) {
      try {
        await apiClient.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!hasPermission('users:view')) {
    return <div>You do not have permission to view users.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Users in {currentTenant?.tenantName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {hasPermission('users:manage') ? (
                      <Select defaultValue={user.roleId} onValueChange={(val) => handleRoleChange(user.userId, val)}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {hasPermission('users:manage') && (
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveUser(user.userId)}>
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}