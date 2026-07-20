'use client';

import React, { useState } from 'react';
import { HardDrive, X, CheckCircle, Link as LinkIcon } from 'lucide-react';

interface EditDriveFolderModalProps {
  isOpen: boolean;
  currentFolderId: string;
  onClose: () => void;
  onSuccess: (newFolderId: string) => void;
}

export const EditDriveFolderModal: React.FC<EditDriveFolderModalProps> = ({
  isOpen,
  currentFolderId,
  onClose,
  onSuccess,
}) => {
  const [folderInput, setFolderInput] = useState(currentFolderId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderInput.trim()) {
      setError('Please enter your Google Drive folder link or folder ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdtaFolderId: folderInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update Google Drive folder access link.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Google Drive SDTA folder linked successfully!');
      setTimeout(() => {
        onSuccess(data.sdtaFolderId || folderInput.trim());
        onClose();
      }, 1200);
    } catch (err) {
      setError('Connection error updating Drive link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="neu-outset w-full max-w-md p-5 sm:p-8 relative rounded-neu border border-white/20 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 neu-button p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 neu-outset flex items-center justify-center text-emerald-500 rounded-2xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">
              Connect SDTA Drive Folder
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provide your personal Google Drive folder link.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
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
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1.5">
              Google Drive SDTA Folder Link or ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                placeholder="Paste https://drive.google.com/drive/folders/1A2B3..."
                className="w-full neu-input px-3.5 py-3 text-xs text-gray-800 dark:text-white pr-10"
                required
              />
              <LinkIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              💡 Create a folder named <strong>sdta</strong> inside your personal Google Drive, set sharing to <strong>Anyone with link can view</strong>, and paste the folder URL here!
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
              className="neu-button px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600"
            >
              {loading ? 'Saving Link...' : 'Save Drive Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
