import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, updateUserSdtaFolder } from '@/lib/userService';

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('stda_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie);
    const user = await getUserById(sessionData.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { sdtaFolderId } = await request.json();
    if (!sdtaFolderId) {
      return NextResponse.json({ error: 'Folder link or ID is required' }, { status: 400 });
    }

    await updateUserSdtaFolder(user.id, sdtaFolderId);

    return NextResponse.json({
      success: true,
      message: 'Google Drive SDTA folder updated successfully',
      sdtaFolderId: user.sdtaFolderId
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update SDTA folder' }, { status: 500 });
  }
}
