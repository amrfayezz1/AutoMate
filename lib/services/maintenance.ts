import { supabase } from '@/lib/supabase';
import type { Tables } from '@/supabase/database.types';

export type MaintenanceRecord = Tables<'maintenance_records'>;
export type MaintenanceType = Tables<'maintenance_types'>;

export type NextDueItem = {
  /** The source maintenance record whose next_due_* set this entry */
  sourceRecordId: string;
  typeId: string;
  typeName: string;
  iconName: string;
  iconColor: string;
  kmLeft: number | null;
  daysLeft: number | null;
  nextDueKm: number | null;
  nextDueDate: string | null;
};

export type ActivityKind = 'maintenance' | 'odometer';

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  label: string;
  occurredAt: string;
  iconName: string;
  iconColor: string;
};

export type SpendItem = {
  typeName: string;
  cost: number;
};

export type MonthlySpend = {
  total: number;
  items: SpendItem[];
};

// Returns all maintenance types (system + the user's custom). RLS-scoped automatically.
export async function fetchMaintenanceTypes(): Promise<MaintenanceType[]> {
  const { data, error } = await supabase
    .from('maintenance_types')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type MaintenanceWritableFields = {
  typeId: string;
  servicedAt: string; // ISO date YYYY-MM-DD
  mileageAtService: number | null;
  cost: number | null;
  providerName: string | null;
  notes: string | null;
  photoUrl: string | null;
  nextDueDate: string | null;
  nextDueKm: number | null;
};

export type CreateMaintenanceInput = MaintenanceWritableFields & {
  carId: string;
};

export async function createMaintenanceRecord(
  input: CreateMaintenanceInput
): Promise<MaintenanceRecord> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('maintenance_records')
    .insert({
      user_id: session.user.id,
      car_id: input.carId,
      type_id: input.typeId,
      serviced_at: input.servicedAt,
      mileage_at_service: input.mileageAtService,
      cost: input.cost,
      provider_name: input.providerName,
      notes: input.notes,
      photo_url: input.photoUrl,
      next_due_date: input.nextDueDate,
      next_due_km: input.nextDueKm,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMaintenanceRecord(
  id: string,
  input: MaintenanceWritableFields
): Promise<MaintenanceRecord> {
  const { data, error } = await supabase
    .from('maintenance_records')
    .update({
      type_id: input.typeId,
      serviced_at: input.servicedAt,
      mileage_at_service: input.mileageAtService,
      cost: input.cost,
      provider_name: input.providerName,
      notes: input.notes,
      photo_url: input.photoUrl,
      next_due_date: input.nextDueDate,
      next_due_km: input.nextDueKm,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMaintenanceRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('maintenance_records')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export type MaintenanceRecordDetail = {
  id: string;
  carId: string;
  typeId: string;
  typeName: string;
  iconName: string;
  iconColor: string;
  servicedAt: string;
  mileageAtService: number | null;
  cost: number | null;
  providerName: string | null;
  notes: string | null;
  photoUrl: string | null;
  nextDueDate: string | null;
  nextDueKm: number | null;
};

export async function fetchMaintenanceRecord(
  id: string
): Promise<MaintenanceRecordDetail> {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select(
      'id, car_id, type_id, serviced_at, mileage_at_service, cost, provider_name, notes, photo_url, next_due_date, next_due_km, maintenance_types(name, icon, color)'
    )
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw error;

  const type = data.maintenance_types as
    | { name: string; icon: string; color: string }
    | null;

  return {
    id: data.id,
    carId: data.car_id,
    typeId: data.type_id,
    typeName: type?.name ?? 'Service',
    iconName: type?.icon ?? 'Wrench',
    iconColor: type?.color ?? '#A1A7B3',
    servicedAt: data.serviced_at,
    mileageAtService: data.mileage_at_service,
    cost: data.cost,
    providerName: data.provider_name,
    notes: data.notes,
    photoUrl: data.photo_url,
    nextDueDate: data.next_due_date,
    nextDueKm: data.next_due_km,
  };
}

// Returns the single most urgent upcoming service for a car.
// "Most urgent" = smallest km gap (if next_due_km set) or soonest date.
export async function fetchNextDue(
  carId: string,
  currentOdometer: number
): Promise<NextDueItem | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('maintenance_records')
    .select(
      'id, next_due_km, next_due_date, type_id, maintenance_types(name, icon, color)'
    )
    .eq('car_id', carId)
    .is('deleted_at', null)
    .or(`next_due_km.not.is.null,next_due_date.not.is.null`)
    .order('next_due_km', { ascending: true, nullsFirst: false })
    .limit(10);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  let best: (typeof data)[0] | null = null;
  let bestKmLeft = Infinity;

  for (const row of data) {
    const kmLeft =
      row.next_due_km != null ? row.next_due_km - currentOdometer : Infinity;
    if (kmLeft < bestKmLeft) {
      bestKmLeft = kmLeft;
      best = row;
    }
  }

  if (!best) return null;

  type JoinedType = { name: string; icon: string; color: string } | null;
  const type = best.maintenance_types as JoinedType;

  const kmLeft =
    best.next_due_km != null ? best.next_due_km - currentOdometer : null;
  const daysLeft = best.next_due_date
    ? Math.ceil(
        (new Date(best.next_due_date).getTime() - new Date(today).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    sourceRecordId: best.id,
    typeId: best.type_id,
    typeName: type?.name ?? 'Service',
    iconName: type?.icon ?? 'Wrench',
    iconColor: type?.color ?? '#A1A7B3',
    kmLeft,
    daysLeft,
    nextDueKm: best.next_due_km ?? null,
    nextDueDate: best.next_due_date ?? null,
  };
}

// Last 5 events across maintenance records + odometer logs, sorted newest first.
export async function fetchRecentActivity(carId: string): Promise<ActivityItem[]> {
  const [maintenanceResult, odometerResult] = await Promise.all([
    supabase
      .from('maintenance_records')
      .select('id, serviced_at, maintenance_types(name, icon, color)')
      .eq('car_id', carId)
      .is('deleted_at', null)
      .order('serviced_at', { ascending: false })
      .limit(5),
    supabase
      .from('odometer_logs')
      .select('id, reading, recorded_at')
      .eq('car_id', carId)
      .order('recorded_at', { ascending: false })
      .limit(5),
  ]);

  if (maintenanceResult.error) throw maintenanceResult.error;
  if (odometerResult.error) throw odometerResult.error;

  type JoinedType = { name: string; icon: string; color: string } | null;

  const maintenanceItems: ActivityItem[] = (maintenanceResult.data ?? []).map(
    (row) => {
      const type = row.maintenance_types as JoinedType;
      return {
        id: row.id,
        kind: 'maintenance',
        label: `${type?.name ?? 'Service'} completed`,
        occurredAt: row.serviced_at,
        iconName: type?.icon ?? 'Wrench',
        iconColor: type?.color ?? '#A1A7B3',
      };
    }
  );

  const odometerItems: ActivityItem[] = (odometerResult.data ?? []).map(
    (row) => ({
      id: row.id,
      kind: 'odometer',
      label: `Mileage updated to ${row.reading.toLocaleString('en-US')} km`,
      occurredAt: row.recorded_at,
      iconName: 'Gauge',
      iconColor: '#A1A7B3',
    })
  );

  return [...maintenanceItems, ...odometerItems]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5);
}

// ─── Upcoming maintenance list ────────────────────────────────────────────

export type MaintenanceStatus = 'overdue' | 'urgent' | 'upcoming';

export type UpcomingItem = {
  id: string;
  typeId: string;
  typeName: string;
  iconName: string;
  iconColor: string;
  status: MaintenanceStatus;
  nextDueDate: string | null;
  nextDueKm: number | null;
};

export type SortOption = 'urgent' | 'name_asc' | 'name_desc';

export type HistorySortOption =
  | 'date_desc'
  | 'date_asc'
  | 'cost_desc'
  | 'cost_asc'
  | 'name_asc'
  | 'name_desc';

export type HistoryItem = {
  id: string;
  typeId: string;
  typeName: string;
  iconName: string;
  iconColor: string;
  servicedAt: string;
  mileageAtService: number | null;
  cost: number | null;
};

export type DateRangeFilter =
  | 'all'
  | 'past_week'
  | 'past_month'
  | '3_months'
  | '6_months'
  | 'past_year';

export type UpcomingFilters = {
  typeId: string | 'all';
  dateRange: DateRangeFilter;
  sort: SortOption;
};

const URGENT_DAY_THRESHOLD = 7;
const URGENT_KM_THRESHOLD = 500;

function computeStatus(
  nextDueDate: string | null,
  nextDueKm: number | null,
  currentOdometer: number
): MaintenanceStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let overdue = false;
  let urgent = false;

  if (nextDueDate) {
    const due = new Date(nextDueDate);
    due.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
    if (daysLeft < 0) overdue = true;
    else if (daysLeft <= URGENT_DAY_THRESHOLD) urgent = true;
  }

  if (nextDueKm != null) {
    const kmLeft = nextDueKm - currentOdometer;
    if (kmLeft < 0) overdue = true;
    else if (kmLeft <= URGENT_KM_THRESHOLD) urgent = true;
  }

  if (overdue) return 'overdue';
  if (urgent) return 'urgent';
  return 'upcoming';
}

function dateRangeCutoff(range: DateRangeFilter): Date | null {
  if (range === 'all') return null;
  const now = new Date();
  const map: Record<Exclude<DateRangeFilter, 'all'>, number> = {
    past_week: 7,
    past_month: 30,
    '3_months': 90,
    '6_months': 180,
    past_year: 365,
  };
  const days = map[range];
  return new Date(now.getTime() - days * 86_400_000);
}

// Returns all upcoming maintenance for a car, with status + filters + sort applied.
export async function fetchUpcoming(
  carId: string,
  currentOdometer: number,
  filters: UpcomingFilters
): Promise<UpcomingItem[]> {
  let query = supabase
    .from('maintenance_records')
    .select(
      'id, type_id, next_due_date, next_due_km, serviced_at, maintenance_types(name, icon, color)'
    )
    .eq('car_id', carId)
    .is('deleted_at', null)
    .or('next_due_km.not.is.null,next_due_date.not.is.null');

  if (filters.typeId !== 'all') {
    query = query.eq('type_id', filters.typeId);
  }

  const cutoff = dateRangeCutoff(filters.dateRange);
  if (cutoff) {
    query = query.gte('serviced_at', cutoff.toISOString().split('T')[0]);
  }

  const { data, error } = await query;
  if (error) throw error;

  type JoinedType = { name: string; icon: string; color: string } | null;

  const items: UpcomingItem[] = (data ?? []).map((row) => {
    const type = row.maintenance_types as JoinedType;
    return {
      id: row.id,
      typeId: row.type_id,
      typeName: type?.name ?? 'Service',
      iconName: type?.icon ?? 'Wrench',
      iconColor: type?.color ?? '#A1A7B3',
      status: computeStatus(row.next_due_date, row.next_due_km, currentOdometer),
      nextDueDate: row.next_due_date,
      nextDueKm: row.next_due_km,
    };
  });

  // Sort
  const statusWeight: Record<MaintenanceStatus, number> = {
    overdue: 0,
    urgent: 1,
    upcoming: 2,
  };

  items.sort((a, b) => {
    if (filters.sort === 'name_asc') return a.typeName.localeCompare(b.typeName);
    if (filters.sort === 'name_desc') return b.typeName.localeCompare(a.typeName);
    // urgent: by status, then by soonest due date / km
    const statusDiff = statusWeight[a.status] - statusWeight[b.status];
    if (statusDiff !== 0) return statusDiff;
    const aDate = a.nextDueDate ? new Date(a.nextDueDate).getTime() : Infinity;
    const bDate = b.nextDueDate ? new Date(b.nextDueDate).getTime() : Infinity;
    return aDate - bDate;
  });

  return items;
}

// Returns the maintenance history (past serviced records) for a car.
export async function fetchHistory(
  carId: string,
  filters: { typeId: string | 'all'; dateRange: DateRangeFilter; sort: HistorySortOption }
): Promise<HistoryItem[]> {
  let query = supabase
    .from('maintenance_records')
    .select(
      'id, type_id, serviced_at, mileage_at_service, cost, maintenance_types(name, icon, color)'
    )
    .eq('car_id', carId)
    .is('deleted_at', null);

  if (filters.typeId !== 'all') {
    query = query.eq('type_id', filters.typeId);
  }

  const cutoff = dateRangeCutoff(filters.dateRange);
  if (cutoff) {
    query = query.gte('serviced_at', cutoff.toISOString().split('T')[0]);
  }

  const { data, error } = await query;
  if (error) throw error;

  type JoinedType = { name: string; icon: string; color: string } | null;

  const items: HistoryItem[] = (data ?? []).map((row) => {
    const type = row.maintenance_types as JoinedType;
    return {
      id: row.id,
      typeId: row.type_id,
      typeName: type?.name ?? 'Service',
      iconName: type?.icon ?? 'Wrench',
      iconColor: type?.color ?? '#A1A7B3',
      servicedAt: row.serviced_at,
      mileageAtService: row.mileage_at_service,
      cost: row.cost,
    };
  });

  items.sort((a, b) => {
    switch (filters.sort) {
      case 'date_desc':
        return new Date(b.servicedAt).getTime() - new Date(a.servicedAt).getTime();
      case 'date_asc':
        return new Date(a.servicedAt).getTime() - new Date(b.servicedAt).getTime();
      case 'cost_desc':
        return (b.cost ?? -Infinity) - (a.cost ?? -Infinity);
      case 'cost_asc':
        return (a.cost ?? Infinity) - (b.cost ?? Infinity);
      case 'name_asc':
        return a.typeName.localeCompare(b.typeName);
      case 'name_desc':
        return b.typeName.localeCompare(a.typeName);
    }
  });

  return items;
}

// Distinct maintenance types from this car's history records (for the filter chip row).
export async function fetchHistoryTypeFacets(
  carId: string
): Promise<Array<{ id: string; name: string }>> {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select('type_id, maintenance_types(name)')
    .eq('car_id', carId)
    .is('deleted_at', null);

  if (error) throw error;

  const seen = new Map<string, string>();
  for (const row of data ?? []) {
    const name = (row.maintenance_types as { name: string } | null)?.name;
    if (row.type_id && name) seen.set(row.type_id, name);
  }
  return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

// Distinct maintenance types used in this car's upcoming records (for the filter chip row).
export async function fetchUpcomingTypeFacets(
  carId: string
): Promise<Array<{ id: string; name: string }>> {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select('type_id, maintenance_types(name)')
    .eq('car_id', carId)
    .is('deleted_at', null)
    .or('next_due_km.not.is.null,next_due_date.not.is.null');

  if (error) throw error;

  const seen = new Map<string, string>();
  for (const row of data ?? []) {
    const name = (row.maintenance_types as { name: string } | null)?.name;
    if (row.type_id && name) seen.set(row.type_id, name);
  }
  return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

// Sum + line items for the current calendar month.
export async function fetchMonthlySpend(carId: string): Promise<MonthlySpend> {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const { data, error } = await supabase
    .from('maintenance_records')
    .select('cost, maintenance_types(name)')
    .eq('car_id', carId)
    .is('deleted_at', null)
    .gte('serviced_at', firstDay)
    .lte('serviced_at', lastDay)
    .not('cost', 'is', null);

  if (error) throw error;

  const items: SpendItem[] = (data ?? [])
    .filter((row) => row.cost != null)
    .map((row) => ({
      typeName:
        (row.maintenance_types as { name: string } | null)?.name ?? 'Service',
      cost: row.cost as number,
    }));

  const total = items.reduce((sum, item) => sum + item.cost, 0);
  return { total, items };
}
