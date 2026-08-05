import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SEEDED_KEY_PREFIX = 'sanctuary_seeded_';

function parseRow<T>(row: any): T {
  if (row && typeof row === 'object') {
    if (row.payload && typeof row.payload === 'object') {
      return { ...row.payload, id: row.id || row.payload.id };
    }
  }
  return row as T;
}

export async function getTableData<T extends { id: string }>(
  table: string, 
  fallback: T[], 
  shouldSeed: boolean = true
): Promise<T[]> {
  const localKey = `sanctuary_${table}`;

  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(localKey);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(`Error parsing local storage for ${table}:`, e);
      }
    }
    return fallback;
  }

  try {
    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      console.warn(`Supabase error for table ${table}, falling back to localStorage:`, error.message);
      const local = localStorage.getItem(localKey);
      return local ? JSON.parse(local) : fallback;
    }

    if (!data || data.length === 0) {
      const alreadySeeded = localStorage.getItem(`${SEEDED_KEY_PREFIX}${table}`);
      if (shouldSeed && fallback && fallback.length > 0 && !alreadySeeded) {
        console.log(`Seeding table ${table} with initial data in Supabase...`);
        localStorage.setItem(`${SEEDED_KEY_PREFIX}${table}`, 'true');
        await saveAllTableItems(table, fallback);
        return fallback;
      }
      // If table is legitimately empty (or user cleared it), return empty array
      localStorage.setItem(localKey, JSON.stringify([]));
      return [];
    }

    const parsed = data.map(row => parseRow<T>(row));
    localStorage.setItem(localKey, JSON.stringify(parsed));
    return parsed;
  } catch (err) {
    console.warn(`Unexpected error fetching ${table} from Supabase:`, err);
    const local = localStorage.getItem(localKey);
    return local ? JSON.parse(local) : fallback;
  }
}

export async function saveTableItem<T extends { id: string }>(table: string, item: T): Promise<void> {
  const localKey = `sanctuary_${table}`;
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

  try {
    const { error } = await supabase.from(table).upsert({ id: item.id, payload: item });
    if (error) {
      // Fallback: try upserting flat item directly if payload column does not exist
      await supabase.from(table).upsert(item);
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
    const { error } = await supabase.from(table).upsert(rows);
    if (error) {
      await supabase.from(table).upsert(items);
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
    await supabase.from(table).delete().eq('id', id);
  } catch (err) {
    console.error(`Failed to delete item from Supabase table ${table}:`, err);
  }
}

export function subscribeToTable<T>(table: string, onUpdate: (data: T[]) => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
      const { data } = await supabase.from(table).select('*');
      if (data) {
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
