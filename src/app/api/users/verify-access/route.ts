import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/userService';

export async function POST(request: Request) {
  try {
    const { targetUserId, inputPassword } = await request.json();

    if (!targetUserId || !inputPassword) {
      return NextResponse.json({ error: 'Target member ID and password are required' }, { status: 400 });
    }

    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ error: 'Target member not found' }, { status: 444 });
    }

    // Check if entered password matches target user's password
    const isCorrect = targetUser.password.trim() === inputPassword.trim();

    if (!isCorrect) {
      return NextResponse.json({
        granted: false,
        error: `Incorrect password for ${targetUser.name}. Access denied.`
      }, { status: 401 });
    }

    return NextResponse.json({
      granted: true,
      targetUserId: targetUser.id,
      targetUserName: targetUser.name,
      sdtaFolderId: targetUser.sdtaFolderId,
      message: `Security clearance granted for ${targetUser.name}'s SDTA workspace.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
