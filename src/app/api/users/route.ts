import { NextResponse } from 'next/server';
import { getAllUsers, addUser, getUserByEmail } from '@/lib/userService';

export async function GET() {
  try {
    const users = await getAllUsers();
    // Exclude password in response list for security
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      photo: u.photo,
      jobTitle: u.jobTitle,
      department: u.department,
      status: u.status,
      sdtaFolderId: u.sdtaFolderId,
      createdAt: u.createdAt
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, photo, jobTitle, department, status, sdtaFolderId } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const defaultPhoto = photo || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?w=400&auto=format&fit=crop&q=80`;

    const newUser = await addUser({
      name,
      email,
      password,
      role: role === 'ADMIN' ? 'ADMIN' : 'STAFF',
      photo: defaultPhoto,
      jobTitle: jobTitle || 'Staff Member',
      department: department || 'General Operations',
      status: status || 'active',
      sdtaFolderId: sdtaFolderId || `sdta_folder_${name.toLowerCase().replace(/\s+/g, '_')}`
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photo: newUser.photo,
        jobTitle: newUser.jobTitle,
        department: newUser.department,
        status: newUser.status,
        sdtaFolderId: newUser.sdtaFolderId,
        createdAt: newUser.createdAt
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
  }
}
