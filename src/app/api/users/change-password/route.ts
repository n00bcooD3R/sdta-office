import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, updateUserPassword } from '@/lib/userService';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('stda_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const sessionData = JSON.parse(Buffer.from(sessionCookie.split('.')[1], 'base64').toString('utf-8'));
    const user = await getUserById(sessionData.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (user.password !== currentPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: 'New password must be at least 4 characters long' }, { status: 400 });
    }

    await updateUserPassword(user.id, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully in Neon DB'
    });
  } catch (err: any) {
    console.error('Error changing password:', err);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
