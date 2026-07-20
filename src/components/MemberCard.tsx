'use client';

import React from 'react';
import { UserMember } from '@/lib/schema';
import { Folder, Lock, ShieldCheck, Mail, Briefcase, ChevronRight, KeyRound, Trash2 } from 'lucide-react';

interface MemberCardProps {
  member: UserMember;
  currentUser: any;
  onSelectMember: (member: UserMember) => void;
  onDeleteMember?: (member: UserMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currentUser,
  onSelectMember,
  onDeleteMember,
}) => {
  const isSelf = currentUser?.id === member.id;
  const isAdmin = currentUser?.role === 'ADMIN';

  // Staff accessing someone else requires entering target password
  const requiresPassword = !isAdmin && !isSelf;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteMember) {
      onDeleteMember(member);
    }
  };

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="neu-outset group relative p-6 rounded-neu hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top ID Card Header */}
      <div className="flex items-start justify-between mb-4">
        {/* Company Holographic / ID Badge Label */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 neu-inset flex items-center justify-center text-indigo-500 font-mono text-[10px] font-bold">
            ID
          </div>
          <div>
            <p className="text-[10px] tracking-widest font-mono text-gray-400 uppercase font-semibold">
              STDA-STAFF-{member.id.substring(4, 8).toUpperCase()}
            </p>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
              {member.department}
            </p>
          </div>
        </div>

        {/* Status Indicator & Admin Delete Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 neu-inset px-2.5 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${
              member.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
              member.status === 'away' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
              'bg-gray-400'
            }`} />
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 capitalize">
              {member.status}
            </span>
          </div>

          {isAdmin && !isSelf && onDeleteMember && (
            <button
              onClick={handleDelete}
              className="neu-button p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
              title={`Delete member ${member.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main ID Card Profile Section */}
      <div className="flex items-center gap-4 my-2">
        {/* Member Photo Frame */}
        <div className="relative">
          <div className="w-20 h-20 rounded-neu p-1.5 neu-inset">
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          {member.role === 'ADMIN' && (
            <span className="absolute -top-1 -right-1 neu-outset w-6 h-6 flex items-center justify-center text-amber-500 rounded-full" title="Admin User">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {member.name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="truncate font-medium">{member.jobTitle}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate font-mono">{member.email}</span>
          </div>
        </div>
      </div>

      {/* Target Folder Details & Access Tag */}
      <div className="mt-4 pt-3 border-t border-gray-300/30 dark:border-gray-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 neu-inset rounded-lg text-amber-500">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono">SCOPED DIRECTORY</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono">
              sdta/<span className="text-indigo-500">{member.name.split(' ')[0].toLowerCase()}</span>
            </p>
          </div>
        </div>

        {/* Action Button Indicator */}
        <div className="flex items-center gap-1.5">
          {requiresPassword ? (
            <div className="neu-inset px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password Required</span>
            </div>
          ) : (
            <div className="neu-button p-2 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
