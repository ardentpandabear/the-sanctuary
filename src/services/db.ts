import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function getTableData<T>(table: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(`sanctuary_${table}`);
    return local ? JSON.parse(local) : fallback;
  }

  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error || !data || data.length === 0) {
      // If table is empty or error, fallback to initial data and save to localStorage
      const local = localStorage.getItem(`sanctuary_${table}`);
      return local ? JSON.parse(local) : fallback;
    }
    return data as unknown as T;
  } catch (err) {
    console.warn(`Error fetching ${table} from Supabase, falling back to local state`, err);
    const local = localStorage.getItem(`sanctuary_${table}`);
    return local ? JSON.parse(local) : fallback;
  }
}

export function subscribeToTable<T>(table: string, onUpdate: (data: T[]) => void) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
      const { data } = await supabase.from(table).select('*');
      if (data) {
        onUpdate(data as unknown as T[]);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function upsertTableItem(table: string, item: any) {
  // Always update local storage as immediate optimistic update
  const localKey = `sanctuary_${table}`;
  const existing = localStorage.getItem(localKey);
  let list: any[] = existing ? JSON.parse(existing) : [];
  const index = list.findIndex((i: any) => i.id === item.id);
  if (index >= 0) {
    list[index] = item;
  } else {
    list.push(item);
  }
  localStorage.setItem(localKey, JSON.stringify(list));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from(table).upsert(item);
  } catch (err) {
    console.error(`Failed to upsert item to Supabase table ${table}:`, err);
  }
}

export async function deleteTableItem(table: string, id: string) {
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
