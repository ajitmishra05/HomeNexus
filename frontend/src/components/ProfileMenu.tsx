import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuthStore } from '../store/authStore';
import { fetchAPI } from '../lib/api';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, logout, updateUser } = useAuthStore();
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
  });

  const handleUpdate = async () => {
    try {
      const res = await fetchAPI('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      updateUser({ name: res.name });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsEditModalOpen(false);
      setIsOpen(false);
    } catch (e) {
      alert('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await fetchAPI('/users/profile', { method: 'DELETE' });
        alert('Account deleted.');
        logout();
      } catch (e) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2 h-auto rounded-full hover:bg-gray-200">
        <MoreVertical className="w-5 h-5 text-gray-700" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden z-50">
          {user?.role === 'admin' && (
            <button 
              onClick={() => { setIsOpen(false); window.location.href = '/admin-dashboard'; }}
              className="w-full text-left px-4 py-3 text-sm text-purple-700 hover:bg-purple-50 transition-colors font-medium border-b border-gray-100"
            >
              Admin Panel
            </button>
          )}
          <button 
            onClick={() => { setIsEditModalOpen(true); setIsOpen(false); }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Profile
          </button>
          <button 
            onClick={handleDelete}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                <Input 
                  type="password"
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  placeholder="Enter new password to change"
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
          Profile Updated Successfully!
        </div>
      )}
    </div>
  );
};
