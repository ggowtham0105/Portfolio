import { supabase } from '../supabase';

const STORAGE_BUCKET = 'portfolio-assets';

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  return supabase;
}

/**
 * Uploads a certificate PDF/image or project diagram to Supabase Storage and returns its public URL.
 */
export async function uploadAssetFile(file, folder = 'uploads') {
  const client = requireClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function upsertRecord(table, payload, id) {
  const client = requireClient();
  if (id && !String(id).startsWith('default-')) {
    const { error } = await client.from(table).update(payload).eq('id', id);
    if (error) throw error;
    return;
  }
  const { error } = await client.from(table).insert([payload]);
  if (error) throw error;
}

export async function deleteRecord(table, id) {
  const client = requireClient();
  const { error } = await client.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function seedRecords(table, rows) {
  const client = requireClient();
  const sanitized = rows.map((row) => {
    const copy = { ...row };
    delete copy.id;
    return copy;
  });
  const { error } = await client.from(table).insert(sanitized);
  if (error) throw error;
}

export async function saveSiteSettings(settingsObj) {
  const client = requireClient();
  const rows = Object.entries(settingsObj).map(([key, value]) => ({
    key,
    value: String(value ?? ''),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await client.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) throw error;
}

