'use client';

import React, { useState, useEffect } from 'react';
import { UserMember } from '@/lib/schema';
import { UserCheck, X, CheckCircle, Lock, Mail, User, Briefcase, Building, HardDrive, Image as ImageIcon } from 'lucide-react';

interface EditMemberModalProps {
  isOpen: boolean;
  member: UserMember | null;
  onClose: () => void;
  onMemberUpdated: () => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onMemberUpdated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [sdtaFolderId, setSdtaFolderId] = useState('');
  const [photo, setPhoto] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setPassword(''); // Leave blank unless changing
      setJobTitle(member.jobTitle || '');
      setDepartment(member.department || '');
      setSdtaFolderId(member.sdtaFolderId || '');
      setPhoto(member.photo || '');
      setError(null);
      setSuccessMsg(null);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: member.id,
          name: name.trim(),
          email: email.trim(),
          password: password.trim() || undefined,
          jobTitle: jobTitle.trim(),
          department: department.trim(),
          sdtaFolderId: sdtaFolderId.trim(),
          photo: photo.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update member details.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Member profile updated successfully in Neon DB!');
      setTimeout(() => {
        onMemberUpdated();
        onClose();
      }, 1200);
    } catch (err) {
      setError('Connection error updating member details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="neu-outset w-full max-w-lg p-5 sm:p-8 relative rounded-neu border border-white/20 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-button p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 neu-outset flex items-center justify-center text-indigo-500 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
              Edit Team Member Profile
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update member photo, email, drive link, and password.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
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
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
              Reset Password (Optional)
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
            />
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
                className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
              Google Drive SDTA Folder Link or ID
            </label>
            <input
              type="text"
              value={sdtaFolderId}
              onChange={(e) => setSdtaFolderId(e.target.value)}
              placeholder="Paste Google Drive folder URL or ID"
              className="w-full neu-input px-3.5 py-2.5 text-xs text-gray-800 dark:text-white"
            />
            <p className="text-[10px] text-gray-400 mt-1">Specific Google Drive folder for this member.</p>
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
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
