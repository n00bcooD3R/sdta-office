import { getSql, isNeonConfigured } from './db';
import { UserMember, INITIAL_MEMBERS } from './schema';

// Local in-memory cache for fast fallback
let mockUsersStore: UserMember[] = [...INITIAL_MEMBERS];

export async function initDatabase() {
  const sql = getSql();
  if (!sql) return;

  try {
    // Create users table if not exists in Neon PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'STAFF',
        photo TEXT,
        job_title VARCHAR(255),
        department VARCHAR(255),
        status VARCHAR(32) DEFAULT 'active',
        sdta_folder_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed default members if not present
    for (const m of INITIAL_MEMBERS) {
      await sql`
        INSERT INTO users (id, name, email, password, role, photo, job_title, department, status, sdta_folder_id)
        VALUES (${m.id}, ${m.name}, ${m.email}, ${m.password}, ${m.role}, ${m.photo}, ${m.jobTitle}, ${m.department}, ${m.status}, ${m.sdtaFolderId})
        ON CONFLICT (email) DO NOTHING
      `;
    }
    console.log('✅ Neon database schema & admin users verified.');
  } catch (err) {
    console.warn('Neon database auto-init notice (using memory fallback):', err);
  }
}

export async function getAllUsers(): Promise<UserMember[]> {
  const sql = getSql();
  if (!sql) {
    return mockUsersStore;
  }

  try {
    await initDatabase();
    const rows = await sql`SELECT * FROM users ORDER BY created_at ASC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      password: r.password,
      role: r.role as 'ADMIN' | 'STAFF',
      photo: r.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      jobTitle: r.job_title || 'Team Member',
      department: r.department || 'General',
      status: (r.status as 'active' | 'away' | 'offline') || 'active',
      sdtaFolderId: r.sdta_folder_id || `sdta_${r.id}`,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Error querying Neon DB, using memory store:', err);
    return mockUsersStore;
  }
}

export async function getUserByEmail(email: string): Promise<UserMember | null> {
  const users = await getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  // Exact match
  let found = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (found) return found;

  // Domain alias match for admin (e.g. admin@sdta.in -> admin@stda.io)
  if (cleanEmail.startsWith('admin@')) {
    found = users.find(u => u.role === 'ADMIN' || u.email.startsWith('admin@'));
    if (found) return found;
  }

  return null;
}

export async function getUserById(id: string): Promise<UserMember | null> {
  const users = await getAllUsers();
  return users.find(u => u.id === id) || null;
}

export async function addUser(member: Omit<UserMember, 'id' | 'createdAt'>): Promise<UserMember> {
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const createdAt = new Date().toISOString();
  const newUser: UserMember = {
    ...member,
    id,
    createdAt,
    sdtaFolderId: member.sdtaFolderId || `sdta_folder_${id}`
  };

  const sql = getSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO users (id, name, email, password, role, photo, job_title, department, status, sdta_folder_id)
        VALUES (${id}, ${newUser.name}, ${newUser.email}, ${newUser.password}, ${newUser.role}, ${newUser.photo}, ${newUser.jobTitle}, ${newUser.department}, ${newUser.status}, ${newUser.sdtaFolderId})
      `;
    } catch (err) {
      console.warn('Error inserting into Neon DB:', err);
    }
  }

  mockUsersStore.push(newUser);
  return newUser;
}

export function extractFolderId(input: string): string {
  if (!input) return '';
  const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim();
}

export async function updateUserSdtaFolder(userId: string, rawFolderInput: string): Promise<boolean> {
  const cleanFolderId = extractFolderId(rawFolderInput);
  if (!cleanFolderId) return false;

  const sql = getSql();
  if (sql) {
    try {
      await sql`
        UPDATE users
        SET sdta_folder_id = ${cleanFolderId}
        WHERE id = ${userId}
      `;
    } catch (err) {
      console.warn('Error updating sdta_folder_id in Neon DB:', err);
    }
  }

  const idx = mockUsersStore.findIndex(u => u.id === userId);
  if (idx !== -1) {
    mockUsersStore[idx].sdtaFolderId = cleanFolderId;
  }
  return true;
}

export async function deleteUser(id: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await sql`DELETE FROM users WHERE id = ${id}`;
    } catch (err) {
      console.warn('Error deleting user from Neon DB:', err);
    }
  }

  mockUsersStore = mockUsersStore.filter(u => u.id !== id);
  return true;
}
