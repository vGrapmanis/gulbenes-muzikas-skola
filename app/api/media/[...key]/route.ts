import type { NextRequest } from 'next/server';
import { getFromR2 } from '@/lib/r2';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join('/');

  const result = await getFromR2(objectKey);
  if (!result) return new Response(null, { status: 404 });

  return new Response(result.body, {
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
