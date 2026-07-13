// Minimal R2Bucket interface for our usage — avoids importing @cloudflare/workers-types
// globally (which conflicts with Next.js DOM types).
interface R2HttpMetadata {
  contentType?: string;
}
interface R2PutOptions {
  httpMetadata?: R2HttpMetadata;
}
interface R2ObjectBody {
  body: ReadableStream;
  httpMetadata?: R2HttpMetadata;
}
interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string | string[]): Promise<void>;
}

// Extend the global CloudflareEnv interface (declared by @opennextjs/cloudflare)
// with the project-specific bindings defined in wrangler.jsonc.
declare global {
  interface CloudflareEnv {
    MEDIA: R2Bucket;
  }
}

export {};
