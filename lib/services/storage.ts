import { supabase } from '@/lib/supabase';

const MAINTENANCE_BUCKET = 'documents';
const MAINTENANCE_PREFIX = 'maintenance';

function extFromUri(uri: string): string {
  const match = /\.([a-zA-Z0-9]+)(?:\?|$)/.exec(uri);
  const ext = match?.[1]?.toLowerCase() ?? 'jpg';
  // Normalize jpeg → jpg for predictable paths
  return ext === 'jpeg' ? 'jpg' : ext;
}

function mimeFromExt(ext: string): string {
  switch (ext) {
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'jpg':
    default: return 'image/jpeg';
  }
}

// Uploads a local image URI to storage. Returns the storage path (not a URL),
// so it can be regenerated as a signed URL on read.
export async function uploadMaintenancePhoto(localUri: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const ext = extFromUri(localUri);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${session.user.id}/${MAINTENANCE_PREFIX}/${filename}`;

  // React Native fetch can read file:// URIs and produce a Blob the SDK accepts.
  const response = await fetch(localUri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(MAINTENANCE_BUCKET)
    .upload(path, blob, {
      contentType: mimeFromExt(ext),
      upsert: false,
    });

  if (error) throw error;
  return path;
}

export async function deleteMaintenancePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(MAINTENANCE_BUCKET)
    .remove([path]);
  if (error) throw error;
}

// Generates a short-lived signed URL for displaying a stored photo.
export async function getMaintenancePhotoUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(MAINTENANCE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
