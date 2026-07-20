'use client';

import React, { useState } from 'react';
import { UserMember } from '@/lib/schema';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface SecurityPromptModalProps {
  targetMember: UserMember | null;
  onClose: () => void;
  onSuccess: (targetMember: UserMember) => void;
}

export const SecurityPromptModal: React.FC<SecurityPromptModalProps> = ({
  targetMember,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!targetMember) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the access password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/users/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: targetMember.id,
          inputPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.granted) {
        setError(data.error || 'Incorrect password. Access denied.');
        setLoading(false);
        return;
      }

      onSuccess(targetMember);
    } catch (err: any) {
      setError('Connection error verifying password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="neu-outset w-full max-w-md p-8 relative rounded-neu border border-white/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-button p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Icon Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 neu-outset flex items-center justify-center text-amber-500 mb-3 rounded-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
            Staff Access Verification
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            To view <span className="font-bold text-indigo-500">{targetMember.name}</span>&apos;s SDTA Drive files, please enter their member password.
          </p>
        </div>

        {/* Target User Avatar Preview Card */}
        <div className="neu-inset p-3.5 flex items-center gap-3 mb-6 rounded-2xl">
          <img
            src={targetMember.photo}
            alt={targetMember.name}
            className="w-12 h-12 rounded-xl object-cover border border-white/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
              {targetMember.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {targetMember.jobTitle} • <span className="font-mono">{targetMember.email}</span>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Member Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`Enter ${targetMember.name.split(' ')[0]}'s password (e.g. ${targetMember.password})`}
                className="w-full neu-input px-4 py-3.5 text-sm text-gray-800 dark:text-white pr-10"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute right-3.5 top-4" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 font-mono">
              💡 Demo Password: <span className="text-indigo-400 font-bold">{targetMember.password}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 neu-button py-3 text-xs font-bold text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 neu-button py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
