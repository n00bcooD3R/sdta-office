export const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export async function checkFastApiHealth() {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/health`, {
      cache: 'no-store'
    });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false };
  }
}

export async function processFileWithFastApi(fileId: string, fileName: string, category: string, authorName?: string) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/drive/process-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id: fileId,
        file_name: fileName,
        category,
        author_name: authorName || 'Team Member'
      })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('FastAPI microservice unreachable, falling back to client engine.');
    return null;
  }
}
