import { NextResponse } from 'next/server';
import { getSdtaDriveFiles } from '@/lib/gdrive';
import { getUserById } from '@/lib/userService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID parameter required' }, { status: 400 });
    }

    const member = await getUserById(userId);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const files = await getSdtaDriveFiles(member.sdtaFolderId, member.name);

    return NextResponse.json({
      member: {
        id: member.id,
        name: member.name,
        sdtaFolderId: member.sdtaFolderId,
        photo: member.photo
      },
      files
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch SDTA drive files' }, { status: 500 });
  }
}
