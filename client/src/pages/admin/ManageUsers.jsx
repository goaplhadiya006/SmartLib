import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Trash2, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const ManageUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userObj) => {
    const newRole = userObj.role === 'admin' ? 'user' : 'admin';
    try {
      await API.put(`/users/${userObj._id}/role`, { role: newRole });
      toast.success(`Role for ${userObj.name} updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await API.delete(`/users/${selectedUser._id}`);
      toast.success(`Deleted user "${selectedUser.name}"`);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Registered Users</h1>
        <p className="text-xs text-slate-500">View member profiles, active borrowing activity, and manage administrator access.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching user accounts..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Active Borrowings</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={u.profileImage?.startsWith('/uploads') ? u.profileImage : u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">{u.email}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to toggle Admin / User role"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="capitalize">{u.role}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{u.activeBorrows || 0}</span>
                      <span className="text-slate-400 text-xs"> active</span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete User Account"
        message={`Are you sure you want to delete user account "${selectedUser?.name}"?`}
        confirmText="Delete Account"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default ManageUsers;
