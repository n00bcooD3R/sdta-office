'use client';

import React, { useState, useEffect } from 'react';
import { DriveFileItem } from '@/lib/schema';
import { X, FileText, Table, Image as ImageIcon, Film, Download, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DriveFileViewerModalProps {
  file: DriveFileItem | null;
  onClose: () => void;
}

export const DriveFileViewerModal: React.FC<DriveFileViewerModalProps> = ({ file, onClose }) => {
  const [excelSheets, setExcelSheets] = useState<{ name: string; rows: any[] }[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [imgSrcIndex, setImgSrcIndex] = useState(0);

  useEffect(() => {
    setImgSrcIndex(0);
    if (file && file.category === 'excel') {
      fetchExcelData();
    }
  }, [file]);

  const fetchExcelData = async () => {
    setLoadingExcel(true);
    try {
      const res = await fetch('/api/drive/excel-sample');
      const arrayBuffer = await res.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const sheets = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        return {
          name: sheetName,
          rows: json as any[],
        };
      });

      setExcelSheets(sheets);
    } catch (err) {
      console.error('Error reading Excel spreadsheet:', err);
    } finally {
      setLoadingExcel(false);
    }
  };

  if (!file) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Generate robust image sources for Google Drive files
  const getImageSources = (item: DriveFileItem) => {
    const sources: string[] = [];
    if (item.id) {
      sources.push(`https://lh3.googleusercontent.com/d/${item.id}`);
      sources.push(`https://drive.google.com/thumbnail?id=${item.id}&sz=w1600`);
      sources.push(`https://drive.google.com/uc?export=view&id=${item.id}`);
    }
    if (item.thumbnailUrl) {
      sources.push(item.thumbnailUrl.replace(/=s\d+/, '=s1600'));
    }
    if (item.previewUrl) {
      sources.push(item.previewUrl);
    }
    return sources;
  };

  const imageSources = getImageSources(file);
  const currentImageSrc = imageSources[imgSrcIndex] || imageSources[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="neu-outset w-full max-w-5xl h-[85vh] flex flex-col relative rounded-neu border border-white/20 overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-300/30 dark:border-gray-700/30 flex items-center justify-between neu-outset rounded-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 neu-inset flex items-center justify-center rounded-xl ${
              file.category === 'pdf' ? 'text-rose-500' :
              file.category === 'excel' ? 'text-emerald-500' :
              file.category === 'image' ? 'text-indigo-500' :
              file.category === 'video' ? 'text-amber-500' : 'text-gray-400'
            }`}>
              {file.category === 'pdf' && <FileText className="w-5 h-5" />}
              {file.category === 'excel' && <Table className="w-5 h-5" />}
              {file.category === 'image' && <ImageIcon className="w-5 h-5" />}
              {file.category === 'video' && <Film className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-800 dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>{formatFileSize(file.size)}</span> • 
                <span className="uppercase font-mono font-bold text-indigo-500">{file.category}</span> • 
                <span>SDTA Scoped Document</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {file.previewUrl && (
              <a
                href={file.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="neu-button px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5"
                title="Open in Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Drive</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="neu-button p-2 text-gray-500 hover:text-rose-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-neu-bg/50 flex flex-col">
          
          {/* Photo Gallery Viewer */}
          {file.category === 'image' && (
            <div className="flex-1 w-full h-full neu-inset p-4 rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src={currentImageSrc}
                alt={file.name}
                onError={() => {
                  if (imgSrcIndex < imageSources.length - 1) {
                    setImgSrcIndex(imgSrcIndex + 1);
                  }
                }}
                className="max-h-full max-w-full object-contain rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Video Player */}
          {file.category === 'video' && (
            <div className="flex-1 w-full h-full neu-inset p-4 rounded-2xl flex items-center justify-center bg-black/40 overflow-hidden">
              {file.id ? (
                <iframe
                  src={`https://drive.google.com/file/d/${file.id}/preview`}
                  className="w-full h-full rounded-xl border-0"
                  allow="autoplay"
                  title={file.name}
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-xl shadow-2xl"
                  src={file.previewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                >
                  Your browser does not support HTML5 video playback.
                </video>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
