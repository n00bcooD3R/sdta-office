'use client';

import React, { useState } from 'react';
import { UserMember } from '@/lib/schema';
import { UserPlus, X, Image as ImageIcon, Shield, Mail, Lock, Briefcase, Building } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: (newMember: UserMember) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onMemberAdded,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [photo, setPhoto] = useState('');
  const [sdtaFolderId, setSdtaFolderId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          jobTitle: jobTitle || 'Team Specialist',
          department: department || 'Operations',
          photo: photo || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
          status: 'active',
          sdtaFolderId: sdtaFolderId.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create member');
        setLoading(false);
        return;
      }

      onMemberAdded(data.user);
      onClose();
      // Reset
      setName('');
      setEmail('');
      setPassword('');
      setJobTitle('');
      setDepartment('');
      setPhoto('');
    } catch (err) {
      setError('Connection error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="neu-outset w-full max-w-lg p-8 relative rounded-neu border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-button p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 neu-outset flex items-center justify-center text-indigo-500 rounded-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
              Add New Team Member
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provision member profile &amp; Google Drive SDTA workspace.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@stda.io"
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Member Password *
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set login password"
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Role Permission
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white bg-transparent"
              >
                <option value="STAFF" className="dark:bg-gray-800">STAFF MEMBER</option>
                <option value="ADMIN" className="dark:bg-gray-800">ADMINISTRATOR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Product Engineer"
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Engineering / Product"
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
              Google Drive SDTA Folder ID (Optional)
            </label>
            <input
              type="text"
              value={sdtaFolderId}
              onChange={(e) => setSdtaFolderId(e.target.value)}
              placeholder="e.g. 1A2B3C4D5E6F7G8H9I0J or leave empty"
              className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
            />
            <p className="text-[10px] text-gray-400 mt-1">Specific Google Drive subfolder ID assigned to this member.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
              Avatar Photo (Google Drive Link or Image URL)
            </label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="Paste Google Drive photo link or image URL"
              className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              💡 Paste a Google Drive file link or image URL. Leave empty to auto-generate a fallback avatar.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-300/30 dark:border-gray-700/30">
            <button
              type="button"
              onClick={onClose}
              className="neu-button px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="neu-button px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600"
            >
              {loading ? 'Creating Member...' : 'Create & Provision Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
