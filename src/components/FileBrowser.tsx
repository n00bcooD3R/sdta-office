'use client';

import React, { useState } from 'react';
import { UserMember, DriveFileItem } from '@/lib/schema';
import { Folder, FileText, Table, Image as ImageIcon, Film, ArrowLeft, Search, Filter, Eye, HardDrive, RefreshCw, ExternalLink } from 'lucide-react';

interface FileBrowserProps {
  targetMember: UserMember;
  files: DriveFileItem[];
  loading: boolean;
  onBack: () => void;
  onSelectFile: (file: DriveFileItem) => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  targetMember,
  files,
  loading,
  onBack,
  onSelectFile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: DriveFileItem['category']) => {
    switch (category) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'excel':
        return <Table className="w-5 h-5 text-emerald-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-indigo-500" />;
      case 'video':
        return <Film className="w-5 h-5 text-amber-500" />;
      case 'folder':
        return <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />;
      default:
        return <HardDrive className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Directory';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Navigation & Member Workspace Banner */}
      <div className="neu-outset p-6 rounded-neu flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="neu-button p-3 text-gray-700 dark:text-gray-200 hover:text-indigo-600"
            title="Return to Member Cards Grid"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={targetMember.photo}
              alt={targetMember.name}
              className="w-12 h-12 rounded-2xl object-cover neu-outset"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {targetMember.name}&apos;s SDTA Drive
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  sdta/{targetMember.name.split(' ')[0].toLowerCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Google Cloud API Authorized Access Scoped to SDTA Root
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1 neu-inset p-1 rounded-xl">
            {['all', 'pdf', 'excel', 'image', 'video'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                  categoryFilter === cat
                    ? 'neu-pressed text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files inside sdta..."
              className="neu-input px-3.5 py-2 pl-9 text-xs text-gray-800 dark:text-white w-48 sm:w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Files Grid View */}
      {loading ? (
        <div className="neu-outset p-12 text-center flex flex-col items-center justify-center text-gray-500 rounded-neu">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-bold">Querying Google Cloud API for SDTA files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="neu-outset p-12 text-center rounded-neu text-gray-500">
          <p className="text-base font-bold mb-1">No files match your query inside sdta</p>
          <p className="text-xs text-gray-400">Try adjusting your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => {
            const isMedia = file.category === 'image' || file.category === 'video';
            const handleCardClick = () => {
              if (isMedia) {
                onSelectFile(file);
              } else if (file.previewUrl || file.downloadUrl) {
                window.open(file.previewUrl || file.downloadUrl, '_blank', 'noopener,noreferrer');
              }
            };

            return (
              <div
                key={file.id}
                onClick={handleCardClick}
                className="neu-outset group p-5 rounded-neu hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 neu-inset rounded-2xl">
                    {getCategoryIcon(file.category)}
                  </div>

                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                    file.category === 'pdf' ? 'bg-rose-500/10 text-rose-500' :
                    file.category === 'excel' ? 'bg-emerald-500/10 text-emerald-500' :
                    file.category === 'image' ? 'bg-indigo-500/10 text-indigo-500' :
                    file.category === 'video' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {file.category}
                  </span>
                </div>

                <div className="my-2">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-2">
                    {file.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {formatFileSize(file.size)} • {new Date(file.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-300/20 dark:border-gray-700/20 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {isMedia ? (
                    <span className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                      <Eye className="w-3.5 h-3.5" /> View In-App Preview
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <ExternalLink className="w-3.5 h-3.5" /> Open in Google Drive
                    </span>
                  )}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
