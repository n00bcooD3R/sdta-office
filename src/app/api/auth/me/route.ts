import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getUserById } from '@/lib/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'stda_super_secret_jwt_token_key_2026_neomorphism';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stda_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        jobTitle: user.jobTitle,
        department: user.department,
        status: user.status,
        sdtaFolderId: user.sdtaFolderId
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
