// R2 upload/delete helpers.
//
// Production (Cloudflare Worker): uses the MEDIA R2 binding — no credentials needed.
// Local dev (`next dev`): falls back to R2's S3-compatible API via aws4fetch,
// using R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET from .env.local.

import { AwsClient } from 'aws4fetch';

/** Build the public URL for an R2 object key. */
export function mediaUrl(key: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '');
  return `${base}/${key}`;
}

/** Generate a unique R2 key for a PDF document. */
export function newDocumentKey(): string {
  return `documents/${crypto.randomUUID()}.pdf`;
}

/** Generate a unique R2 key for a program document PDF. */
export function newProgramDocumentKey(): string {
  return `program-documents/${crypto.randomUUID()}.pdf`;
}

/** Generate a unique R2 key for a news poster image. */
export function newNewsKey(mime: string): string {
  const ext: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const year = new Date().getFullYear();
  return `news/${year}/${crypto.randomUUID()}.${ext[mime] ?? 'jpg'}`;
}

/** Generate a unique R2 key for an achievement image. */
export function newAchievementKey(mime: string): string {
  const ext: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const year = new Date().getFullYear();
  return `achievements/${year}/${crypto.randomUUID()}.${ext[mime] ?? 'jpg'}`;
}

async function r2Binding(): Promise<CloudflareEnv['MEDIA'] | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env.MEDIA ?? null;
  } catch {
    return null;
  }
}

function s3Client(): AwsClient {
  return new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: 's3',
    region: 'auto',
  });
}

function s3Url(key: string): string {
  const account = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  return `https://${account}.r2.cloudflarestorage.com/${bucket}/${key}`;
}

export async function uploadToR2(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const bucket = await r2Binding();
  if (bucket) {
    await bucket.put(key, body, { httpMetadata: { contentType } });
    return;
  }

  const res = await s3Client().fetch(s3Url(key), {
    method: 'PUT',
    body: body.buffer as ArrayBuffer,
    headers: { 'Content-Type': contentType },
  });
  if (!res.ok) throw new Error(`R2 upload failed: ${res.status} ${await res.text()}`);
}

export async function deleteFromR2(key: string): Promise<void> {
  const bucket = await r2Binding();
  if (bucket) {
    await bucket.delete(key);
    return;
  }

  const res = await s3Client().fetch(s3Url(key), { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 delete failed: ${res.status} ${await res.text()}`);
  }
}

export async function getFromR2(
  key: string
): Promise<{ body: ReadableStream; contentType: string } | null> {
  const bucket = await r2Binding();
  if (bucket) {
    const obj = await bucket.get(key);
    if (!obj) return null;
    return {
      body: obj.body as ReadableStream,
      contentType: obj.httpMetadata?.contentType ?? 'application/octet-stream',
    };
  }

  const res = await s3Client().fetch(s3Url(key));
  if (!res.ok) return null;
  return {
    body: res.body as ReadableStream,
    contentType: res.headers.get('Content-Type') ?? 'application/octet-stream',
  };
}
