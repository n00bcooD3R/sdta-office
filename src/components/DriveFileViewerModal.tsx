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

  useEffect(() => {
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
                title="Open original link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">External Link</span>
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
          
          {/* PDF Viewer */}
          {file.category === 'pdf' && (
            <div className="flex-1 w-full h-full rounded-2xl neu-inset overflow-hidden flex flex-col">
              <iframe
                src={file.previewUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                className="w-full h-full border-0 rounded-2xl"
                title="PDF Document Preview"
              />
            </div>
          )}

          {/* Excel Spreadsheet Table Viewer */}
          {file.category === 'excel' && (
            <div className="flex-1 w-full neu-outset p-6 rounded-2xl flex flex-col">
              {loadingExcel ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                  <p className="text-sm font-bold">Parsing Excel Workbook Sheet Data...</p>
                </div>
              ) : excelSheets.length > 0 ? (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Sheet Tabs */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 border-b border-gray-300/20">
                    <Layers className="w-4 h-4 text-emerald-500 mr-1" />
                    {excelSheets.map((sheet, idx) => (
                      <button
                        key={sheet.name}
                        onClick={() => setActiveSheetIndex(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeSheetIndex === idx
                            ? 'neu-pressed text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                            : 'neu-button text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {sheet.name}
                      </button>
                    ))}
                  </div>

                  {/* Render Data Table */}
                  <div className="flex-1 overflow-auto rounded-xl neu-inset">
                    <table className="w-full text-left text-xs text-gray-800 dark:text-gray-200 border-collapse">
                      <thead>
                        {excelSheets[activeSheetIndex]?.rows[0] && (
                          <tr className="border-b border-gray-300/40 dark:border-gray-700/60 bg-gray-500/5">
                            {excelSheets[activeSheetIndex].rows[0].map((col: any, colIdx: number) => (
                              <th key={colIdx} className="px-4 py-3 font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                {col}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-gray-300/20 dark:divide-gray-800">
                        {excelSheets[activeSheetIndex]?.rows.slice(1).map((row: any[], rowIdx: number) => (
                          <tr key={rowIdx} className="hover:bg-indigo-500/5 transition-colors">
                            {row.map((cell: any, cellIdx: number) => (
                              <td key={cellIdx} className="px-4 py-3 font-medium">
                                {cell !== undefined && cell !== null ? String(cell) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 my-auto">No sheet rows detected</div>
              )}
            </div>
          )}

          {/* Photo Gallery Viewer */}
          {file.category === 'image' && (
            <div className="flex-1 w-full h-full neu-inset p-4 rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src={file.previewUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'}
                alt={file.name}
                className="max-h-full max-w-full object-contain rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Video Player */}
          {file.category === 'video' && (
            <div className="flex-1 w-full h-full neu-inset p-4 rounded-2xl flex items-center justify-center bg-black/40 overflow-hidden">
              <video
                controls
                autoPlay
                className="max-h-full max-w-full rounded-xl shadow-2xl"
                src={file.previewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
