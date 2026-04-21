import { useEffect, useState } from 'react';
import { fetchAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, healthData] = await Promise.all([
        fetchAPI('/admin/users'),
        fetchAPI('/admin/system-health'),
      ]);
      setUsers(usersData);
      setHealth(healthData);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to terminate this user and all their associated data?')) {
      try {
        await fetchAPI(`/admin/users/${userId}`, { method: 'DELETE' });
        alert('User terminated successfully.');
        fetchData(); // Refresh list
      } catch (error) {
        console.error(error);
        alert('Failed to delete user.');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Admin God Mode</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80">Global Average Rating (C)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {health?.globalAverageRating ? health.globalAverageRating.toFixed(2) : '0.00'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Providers With Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {health?.providersWithVotes || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {health?.totalRegisteredUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 overflow-hidden shadow-sm">
          <CardHeader>
            <CardTitle>Master User List</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-y">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'resident' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'}`}>
                        {u.role.replace('serviceProvider', 'Provider')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u._id !== currentUser?._id && u.role !== 'admin' && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteUser(u._id)}
                          className="h-8 text-xs px-3"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-gray-500">No users found.</div>
            )}
          </div>
        </Card>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
