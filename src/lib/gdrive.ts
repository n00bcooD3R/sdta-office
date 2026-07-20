import { google } from 'googleapis';
import { DriveFileItem } from './schema';
import { extractFolderId } from './userService';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

export const isGoogleDriveConfigured = Boolean(GOOGLE_API_KEY);

/**
 * Fetch files from Google Drive API scoped to specific user 'sdta' folder
 */
export async function getSdtaDriveFiles(userSdtaFolderId: string, memberName: string): Promise<DriveFileItem[]> {
  if (isGoogleDriveConfigured) {
    try {
      const drive = google.drive({ version: 'v3', auth: GOOGLE_API_KEY });
      
      const targetFolderId = extractFolderId(userSdtaFolderId) || GOOGLE_DRIVE_FOLDER_ID;

      if (!targetFolderId) {
        return [];
      }

      // Query files inside the target user's Google Drive folder
      const res = await drive.files.list({
        q: `'${targetFolderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime, thumbnailLink, webViewLink, webContentLink)',
        pageSize: 50,
      });

      if (res.data.files) {
        return res.data.files.map((f): DriveFileItem => {
          let category: DriveFileItem['category'] = 'other';
          const mime = f.mimeType || '';
          if (mime.includes('pdf')) category = 'pdf';
          else if (mime.includes('sheet') || mime.includes('excel') || f.name?.endsWith('.xlsx') || f.name?.endsWith('.csv')) category = 'excel';
          else if (mime.includes('image')) category = 'image';
          else if (mime.includes('video')) category = 'video';
          else if (mime.includes('folder')) category = 'folder';

          return {
            id: f.id || `file_${Math.random()}`,
            name: f.name || 'Untitled',
            mimeType: f.mimeType || 'application/octet-stream',
            size: f.size ? parseInt(f.size, 10) : 1024 * 1024,
            updatedAt: f.modifiedTime || new Date().toISOString(),
            thumbnailUrl: f.thumbnailLink ?? undefined,
            previewUrl: (f.webViewLink || f.webContentLink) ?? undefined,
            downloadUrl: f.webContentLink ?? undefined,
            category,
            authorName: memberName
          };
        });
      }
    } catch (err) {
      console.warn("Google Drive API fetch error:", err);
    }
  }

  // Fallback for unconfigured API
  return getMockSdtaFolderFiles(userSdtaFolderId, memberName);
}

function getMockSdtaFolderFiles(folderId: string, memberName: string): DriveFileItem[] {
  const sanitizeName = memberName.split(' ')[0].toLowerCase();
  
  return [
    {
      id: `sdta_pdf_${sanitizeName}_01`,
      name: `SDTA_Q3_Strategic_Report_${memberName.replace(/\s+/g, '_')}.pdf`,
      mimeType: 'application/pdf',
      size: 3450000,
      updatedAt: '2026-07-18T10:14:00Z',
      category: 'pdf',
      authorName: memberName,
      previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: `sdta_xls_${sanitizeName}_02`,
      name: `SDTA_Department_Budget_Allocation_2026.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1850000,
      updatedAt: '2026-07-15T16:45:00Z',
      category: 'excel',
      authorName: memberName
    },
    {
      id: `sdta_img_${sanitizeName}_03`,
      name: `SDTA_Architecture_Diagram_V2.png`,
      mimeType: 'image/png',
      size: 4200000,
      updatedAt: '2026-07-12T09:30:00Z',
      category: 'image',
      authorName: memberName,
      previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: `sdta_vid_${sanitizeName}_04`,
      name: `SDTA_Project_Walkthrough_Demo.mp4`,
      mimeType: 'video/mp4',
      size: 24500000,
      updatedAt: '2026-07-10T14:20:00Z',
      category: 'video',
      authorName: memberName,
      previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: `sdta_fld_${sanitizeName}_05`,
      name: `sdta/classified_documents/`,
      mimeType: 'application/vnd.google-apps.folder',
      size: 0,
      updatedAt: '2026-07-08T11:00:00Z',
      category: 'folder',
      authorName: memberName
    }
  ];
}
