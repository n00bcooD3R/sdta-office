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

// Initial mock dataset for Neon DB fallback and demonstration
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
  },
  {
    id: "usr_staff_01",
    name: "Elena Rostova",
    email: "elena@stda.io",
    password: "elena",
    role: "STAFF",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    jobTitle: "Senior Systems Engineer",
    department: "Engineering",
    status: "active",
    sdtaFolderId: "sdta_folder_elena",
    createdAt: "2026-02-10T11:30:00Z"
  },
  {
    id: "usr_staff_02",
    name: "Marcus Sterling",
    email: "marcus@stda.io",
    password: "marcus",
    role: "STAFF",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    jobTitle: "Lead UI/UX Architect",
    department: "Product Design",
    status: "away",
    sdtaFolderId: "sdta_folder_marcus",
    createdAt: "2026-03-01T14:15:00Z"
  },
  {
    id: "usr_staff_03",
    name: "Sophia Chen",
    email: "sophia@stda.io",
    password: "sophia",
    role: "STAFF",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    jobTitle: "Data Analyst & Financial Lead",
    department: "Finance",
    status: "active",
    sdtaFolderId: "sdta_folder_sophia",
    createdAt: "2026-03-18T08:45:00Z"
  },
  {
    id: "usr_staff_04",
    name: "David Miller",
    email: "david@stda.io",
    password: "david",
    role: "STAFF",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    jobTitle: "Security & Infrastructure Lead",
    department: "Security",
    status: "offline",
    sdtaFolderId: "sdta_folder_david",
    createdAt: "2026-04-05T16:20:00Z"
  }
];
