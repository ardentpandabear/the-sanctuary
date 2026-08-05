import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SEEDED_KEY_PREFIX = 'sanctuary_seeded_';

function parseRow<T>(row: any): T {
  if (row && typeof row === 'object') {
    if (row.payload && typeof row.payload === 'object' && Object.keys(row.payload).length > 0) {
      return { ...row.payload, id: row.id || row.payload.id };
    }
  }
  return row as T;
}

export async function getTableData<T extends { id: string }>(
  table: string, 
  fallback: T[], 
  shouldSeed: boolean = false
): Promise<T[]> {
  const localKey = `sanctuary_${table}`;

  // 1. If Supabase is not configured, always return local storage or fallback
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(localKey);
    if (local) {
      try {
        const parsedLocal = JSON.parse(local);
        if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
          return parsedLocal;
        }
      } catch (e) {
        console.error(`Error parsing local storage for ${table}:`, e);
      }
    }
    return fallback;
  }

  try {
    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      console.warn(`Supabase error fetching ${table}, falling back to local state:`, error.message);
      const local = localStorage.getItem(localKey);
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {}
      }
      return fallback;
    }

    // 2. If Supabase table has data, return parsed Supabase data & update local cache
    if (data && data.length > 0) {
      const parsed = data.map(row => parseRow<T>(row));
      localStorage.setItem(localKey, JSON.stringify(parsed));
      return parsed;
    }

    // 3. If Supabase table is EMPTY (0 rows):
    // Check if we have unsynced local data first before assuming empty!
    const local = localStorage.getItem(localKey);
    if (local) {
      try {
        const localItems: T[] = JSON.parse(local);
        if (Array.isArray(localItems) && localItems.length > 0) {
          console.log(`Syncing existing local items for ${table} to Supabase...`);
          await saveAllTableItems(table, localItems);
          return localItems;
        }
      } catch (e) {}
    }

    // 4. If neither Supabase nor LocalStorage have data, seed initial data once
    if (shouldSeed && fallback && fallback.length > 0) {
      console.log(`Seeding table ${table} with initial data in Supabase...`);
      localStorage.setItem(`${SEEDED_KEY_PREFIX}${table}`, 'true');
      await saveAllTableItems(table, fallback);
      return fallback;
    }

    return [];
  } catch (err) {
    console.warn(`Unexpected error fetching ${table} from Supabase:`, err);
    const local = localStorage.getItem(localKey);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return fallback;
  }
}

export async function saveTableItem<T extends { id: string }>(table: string, item: T): Promise<void> {
  const localKey = `sanctuary_${table}`;
  
  // 1. Immediately update local storage to preserve state offline
  const existing = localStorage.getItem(localKey);
  let list: T[] = existing ? JSON.parse(existing) : [];
  const index = list.findIndex((i: T) => i.id === item.id);
  if (index >= 0) {
    list[index] = item;
  } else {
    list.unshift(item);
  }
  localStorage.setItem(localKey, JSON.stringify(list));

  if (!isSupabaseConfigured || !supabase) return;

  // 2. Persist to Supabase
  try {
    const { error: payloadErr } = await supabase.from(table).upsert({ id: item.id, payload: item });
    if (payloadErr) {
      console.warn(`Payload upsert failed for ${table}, attempting direct item upsert:`, payloadErr.message);
      const { error: directErr } = await supabase.from(table).upsert(item);
      if (directErr) {
        console.error(`Both payload and direct upsert failed for Supabase table ${table}:`, directErr);
      }
    }
  } catch (err) {
    console.error(`Failed to upsert item to Supabase table ${table}:`, err);
  }
}

export async function saveAllTableItems<T extends { id: string }>(table: string, items: T[]): Promise<void> {
  const localKey = `sanctuary_${table}`;
  localStorage.setItem(localKey, JSON.stringify(items));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const rows = items.map(item => ({ id: item.id, payload: item }));
    const { error: payloadErr } = await supabase.from(table).upsert(rows);
    if (payloadErr) {
      console.warn(`Bulk payload upsert failed for ${table}, trying direct bulk upsert:`, payloadErr.message);
      const { error: directErr } = await supabase.from(table).upsert(items);
      if (directErr) {
        console.error(`Bulk direct upsert also failed for Supabase table ${table}:`, directErr);
      }
    }
  } catch (err) {
    console.error(`Failed to bulk upsert to Supabase table ${table}:`, err);
  }
}

export async function deleteTableItem(table: string, id: string): Promise<void> {
  const localKey = `sanctuary_${table}`;
  const existing = localStorage.getItem(localKey);
  if (existing) {
    const list = JSON.parse(existing).filter((i: any) => i.id !== id);
    localStorage.setItem(localKey, JSON.stringify(list));
  }

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Failed to delete item ${id} from Supabase table ${table}:`, error.message);
    }
  } catch (err) {
    console.error(`Failed to delete item from Supabase table ${table}:`, err);
  }
}

export function subscribeToTable<T>(table: string, onUpdate: (data: T[]) => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
      const { data, error } = await supabase.from(table).select('*');
      if (!error && data && data.length > 0) {
        const parsed = data.map(row => parseRow<T>(row));
        localStorage.setItem(`sanctuary_${table}`, JSON.stringify(parsed));
        onUpdate(parsed);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
