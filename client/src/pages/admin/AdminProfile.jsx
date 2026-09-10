import React from 'react';
import UserProfile from '../UserProfile';

const AdminProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Administrator Account Profile</h1>
        <p className="text-xs text-slate-500">Manage administrator security credentials, name, and profile image.</p>
      </div>
      <UserProfile />
    </div>
  );
};

export default AdminProfile;
