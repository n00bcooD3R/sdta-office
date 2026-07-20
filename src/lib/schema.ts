export interface UserMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'STAFF';
  photo: string;
  jobTitle: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  sdtaFolderId: string;
  createdAt: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  category: 'pdf' | 'excel' | 'image' | 'video' | 'folder' | 'other';
  authorName?: string;
}

export const INITIAL_MEMBERS: UserMember[] = [
  {
    id: "usr_admin_01",
    name: "Alexander Vance",
    email: "admin@stda.io",
    password: "admin",
    role: "ADMIN",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    jobTitle: "Director of Operations",
    department: "Executive",
    status: "active",
    sdtaFolderId: "sdta_folder_vance",
    createdAt: "2026-01-15T09:00:00Z"
  }
];
