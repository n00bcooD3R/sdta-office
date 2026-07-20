'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserMember, DriveFileItem } from '@/lib/schema';
import { Navbar } from '@/components/Navbar';
import { MemberCard } from '@/components/MemberCard';
import { AddMemberModal } from '@/components/AddMemberModal';
import { SecurityPromptModal } from '@/components/SecurityPromptModal';
import { FileBrowser } from '@/components/FileBrowser';
import { DriveFileViewerModal } from '@/components/DriveFileViewerModal';
import { EditDriveFolderModal } from '@/components/EditDriveFolderModal';
import { Users, ShieldCheck, UserPlus, HardDrive, FileText, Lock, KeyRound, Sparkles, Link as LinkIcon } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [members, setMembers] = useState<UserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Active view state
  const [selectedMember, setSelectedMember] = useState<UserMember | null>(null);
  const [targetPromptMember, setTargetPromptMember] = useState<UserMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDriveModalOpen, setIsEditDriveModalOpen] = useState(false);

  // Files state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [previewFile, setPreviewFile] = useState<DriveFileItem | null>(null);

  useEffect(() => {
    fetchSessionAndMembers();
  }, []);

  const fetchSessionAndMembers = async () => {
    setLoading(true);
    try {
      // 1. Fetch current session
      const sessionRes = await fetch('/api/auth/me');
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.authenticated) {
        router.push('/');
        return;
      }

      setCurrentUser(sessionData.user);

      // 2. Fetch all members list
      const membersRes = await fetch('/api/users');
      const membersData = await membersRes.json();
      setMembers(membersData.users || []);
    } catch (err) {
      console.error('Error initializing dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  // Member tile click handler
  const handleSelectMemberTile = (targetMember: UserMember) => {
    const isSelf = currentUser?.id === targetMember.id;
    const isAdmin = currentUser?.role === 'ADMIN';

    if (isAdmin || isSelf) {
      // Direct access granted
      openMemberDriveWorkspace(targetMember);
    } else {
      // Staff accessing another staff member -> Security password prompt
      setTargetPromptMember(targetMember);
    }
  };

  const openMemberDriveWorkspace = async (member: UserMember) => {
    setSelectedMember(member);
    setLoadingFiles(true);

    try {
      const res = await fetch(`/api/drive/files?userId=${member.id}`);
      const data = await res.json();
      setDriveFiles(data.files || []);
    } catch (err) {
      console.error('Failed to load drive files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleSecurityPromptSuccess = (unlockedMember: UserMember) => {
    setTargetPromptMember(null);
    openMemberDriveWorkspace(unlockedMember);
  };

  const handleMemberAdded = (newMember: UserMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neu-bg text-gray-500">
        <div className="neu-outset p-8 rounded-neu text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold">Loading STDA Neomorphic Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <Navbar
        user={currentUser}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        
        {/* If viewing a member's drive workspace */}
        {selectedMember ? (
          <FileBrowser
            targetMember={selectedMember}
            files={driveFiles}
            loading={loadingFiles}
            onBack={() => setSelectedMember(null)}
            onSelectFile={(file) => setPreviewFile(file)}
          />
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Dashboard Hero Banner & Stats */}
            <div className="neu-outset p-8 rounded-neu flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/20 relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full ${
                    currentUser?.role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {currentUser?.role === 'ADMIN' ? '⚡ Administrator Console' : '🛡️ Staff Console'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Neon PostgreSQL Connected</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white mt-2">
                  Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{currentUser?.name}</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                  {currentUser?.role === 'ADMIN'
                    ? 'Full Administrative Access. You can add new members and inspect all member SDTA Google Drive folders directly.'
                    : 'Staff Access Mode. Select a team member card below to open their SDTA Drive directory (password verification required for secondary members).'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEditDriveModalOpen(true)}
                  className="neu-button px-5 py-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-2 rounded-2xl flex-shrink-0"
                >
                  <LinkIcon className="w-4 h-4 text-emerald-500" />
                  <span>Update My Drive Link</span>
                </button>

                {currentUser?.role === 'ADMIN' && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="neu-button px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center gap-2 rounded-2xl flex-shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Team Member</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="neu-outset p-6 rounded-neu flex items-center gap-4">
                <div className="w-12 h-12 neu-inset flex items-center justify-center text-indigo-500 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Total Members
                  </p>
                  <p className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    {members.length}
                  </p>
                </div>
              </div>

              <div className="neu-outset p-6 rounded-neu flex items-center gap-4">
                <div className="w-12 h-12 neu-inset flex items-center justify-center text-emerald-500 rounded-2xl">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Scoped Workspace
                  </p>
                  <p className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    Google Drive <span className="text-xs font-mono text-indigo-400">/sdta</span>
                  </p>
                </div>
              </div>

              <div className="neu-outset p-6 rounded-neu flex items-center gap-4">
                <div className="w-12 h-12 neu-inset flex items-center justify-center text-amber-500 rounded-2xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Access Policy
                  </p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">
                    {currentUser?.role === 'ADMIN' ? 'Direct Admin Clearance' : 'Staff Password Lock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members Rectangle ID Cards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Team Members Directory
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click any rectangle ID card tile to launch their SDTA Google Drive repository.
                  </p>
                </div>

                <div className="text-xs font-mono text-gray-400 font-semibold">
                  {members.length} Active ID Cards
                </div>
              </div>

              {/* Grid of Rectangle Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    currentUser={currentUser}
                    onSelectMember={handleSelectMemberTile}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Admin Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />

      {/* Staff Password Security Verification Modal */}
      <SecurityPromptModal
        targetMember={targetPromptMember}
        onClose={() => setTargetPromptMember(null)}
        onSuccess={handleSecurityPromptSuccess}
      />

      {/* Multi-format File Viewer Modal (PDF, Excel table, Photo, Video) */}
      <DriveFileViewerModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* Staff Edit Personal SDTA Drive Link Modal */}
      <EditDriveFolderModal
        isOpen={isEditDriveModalOpen}
        currentFolderId={currentUser?.sdtaFolderId || ''}
        onClose={() => setIsEditDriveModalOpen(false)}
        onSuccess={(newFolderId) => {
          setCurrentUser((prev: any) => ({ ...prev, sdtaFolderId: newFolderId }));
          fetchSessionAndMembers();
        }}
      />
    </div>
  );
}
