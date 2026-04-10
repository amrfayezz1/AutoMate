-- ─────────────────────────────────────────────────────────
-- AutoMate — Initial Schema Migration
-- ─────────────────────────────────────────────────────────
-- ─────────────────────────────────────────
-- HELPER: updated_at auto-management
-- ─────────────────────────────────────────
create or replace function set_updated_at() returns trigger language plpgsql
set search_path = public as $$ begin new.updated_at = now();
return new;
end;
$$;
-- ─────────────────────────────────────────
-- PROFILES
-- Automatically created on auth.users insert via trigger.
-- ─────────────────────────────────────────
create table if not exists profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text,
    avatar_url text,
    preferred_language text not null default 'en' check (preferred_language in ('en', 'ar')),
    theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
    notifications_enabled boolean not null default true,
    expo_push_token text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for
update using (auth.uid() = id);
create trigger profiles_updated_at before
update on profiles for each row execute procedure set_updated_at();
-- Trigger: auto-create profile on signup.
-- security definer so the function runs as the owner and can insert despite RLS.
-- set search_path mitigates search-path injection on security definer functions.
create or replace function handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.profiles (id, full_name)
values (new.id, new.raw_user_meta_data->>'full_name');
return new;
end;
$$;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure handle_new_user();
-- ─────────────────────────────────────────
-- CARS
-- ─────────────────────────────────────────
create table if not exists cars (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    make text not null,
    model text not null,
    year int not null check (
        year >= 1886
        and year <= extract(
            year
            from now()
        )::int + 1
    ),
    plate_number text not null,
    current_odometer int not null default 0 check (current_odometer >= 0),
    tracking_mode text not null default 'both' check (tracking_mode in ('time', 'mileage', 'both')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table cars enable row level security;
create policy "Users can view own cars" on cars for
select using (auth.uid() = user_id);
create policy "Users can insert own cars" on cars for
insert with check (auth.uid() = user_id);
create policy "Users can update own cars" on cars for
update using (auth.uid() = user_id);
create policy "Users can delete own cars" on cars for delete using (auth.uid() = user_id);
create index cars_user_id_idx on cars (user_id);
create trigger cars_updated_at before
update on cars for each row execute procedure set_updated_at();
-- ─────────────────────────────────────────
-- MAINTENANCE TYPES
-- System types: is_default = true, user_id = null — readable by everyone.
-- Custom user types: is_default = false, user_id = <owner> — private to owner.
-- ─────────────────────────────────────────
create table if not exists maintenance_types (
    id text primary key,
    user_id uuid references auth.users on delete cascade,
    name text not null,
    color text not null,
    is_default boolean not null default false,
    default_interval_days int,
    default_interval_km int,
    sort_order int not null default 0,
    -- system types have no owner; custom types must have an owner
    constraint maintenance_types_ownership_check check (
        (
            is_default = true
            and user_id is null
        )
        or (
            is_default = false
            and user_id is not null
        )
    )
);
alter table maintenance_types enable row level security;
create policy "Anyone can view system or own custom maintenance types" on maintenance_types for
select using (
        is_default = true
        or auth.uid() = user_id
    );
create policy "Users can insert own custom maintenance types" on maintenance_types for
insert with check (
        auth.uid() = user_id
        and is_default = false
    );
create policy "Users can update own custom maintenance types" on maintenance_types for
update using (
        auth.uid() = user_id
        and is_default = false
    );
create policy "Users can delete own custom maintenance types" on maintenance_types for delete using (
    auth.uid() = user_id
    and is_default = false
);
-- partial index: only custom types have a user_id
create index maintenance_types_user_id_idx on maintenance_types (user_id)
where user_id is not null;
-- Seed system maintenance types
insert into maintenance_types (
        id,
        name,
        color,
        is_default,
        default_interval_days,
        default_interval_km,
        sort_order
    )
values (
        'oil-change',
        'Oil Change',
        '#F59E0B',
        true,
        90,
        5000,
        0
    ),
    (
        'tires',
        'Tires',
        '#6B7280',
        true,
        365,
        10000,
        1
    ),
    (
        'battery',
        'Battery',
        '#3B82F6',
        true,
        730,
        30000,
        2
    ),
    (
        'brakes',
        'Brakes',
        '#EF4444',
        true,
        365,
        20000,
        3
    ),
    (
        'air-filter',
        'Air Filter',
        '#10B981',
        true,
        365,
        15000,
        4
    ),
    (
        'fuel-filter',
        'Fuel Filter',
        '#8B5CF6',
        true,
        730,
        30000,
        5
    ),
    (
        'transmission',
        'Transmission',
        '#EC4899',
        true,
        730,
        50000,
        6
    ),
    (
        'coolant',
        'Coolant',
        '#06B6D4',
        true,
        730,
        40000,
        7
    ),
    (
        'spark-plugs',
        'Spark Plugs',
        '#F97316',
        true,
        730,
        30000,
        8
    ),
    (
        'wipers',
        'Wipers',
        '#6366F1',
        true,
        365,
        20000,
        9
    ) on conflict (id) do nothing;
-- ─────────────────────────────────────────
-- MAINTENANCE RECORDS
-- ─────────────────────────────────────────
create table if not exists maintenance_records (
    id uuid primary key default gen_random_uuid(),
    car_id uuid not null references cars on delete cascade,
    user_id uuid not null references auth.users on delete cascade,
    type_id text not null references maintenance_types (id),
    serviced_at date not null,
    -- nullable: not required when car tracking_mode = 'time'
    mileage_at_service int check (mileage_at_service >= 0),
    cost numeric(10, 2) check (cost >= 0),
    provider_name text,
    notes text,
    photo_url text,
    next_due_date date,
    next_due_km int check (next_due_km >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table maintenance_records enable row level security;
create policy "Users can view own maintenance records" on maintenance_records for
select using (auth.uid() = user_id);
create policy "Users can insert own maintenance records" on maintenance_records for
insert with check (auth.uid() = user_id);
create policy "Users can update own maintenance records" on maintenance_records for
update using (auth.uid() = user_id);
create policy "Users can delete own maintenance records" on maintenance_records for delete using (auth.uid() = user_id);
create index maintenance_records_car_id_idx on maintenance_records (car_id);
create index maintenance_records_user_id_idx on maintenance_records (user_id);
-- supports the home dashboard urgency sort and the edge function due-check
create index maintenance_records_next_due_date_idx on maintenance_records (next_due_date)
where next_due_date is not null;
-- supports the history tab (most recent first per car)
create index maintenance_records_car_history_idx on maintenance_records (car_id, serviced_at desc);
create trigger maintenance_records_updated_at before
update on maintenance_records for each row execute procedure set_updated_at();
-- ─────────────────────────────────────────
-- DOCUMENTS
-- Defined before reminders because reminders hold an FK to documents.
-- ─────────────────────────────────────────
create table if not exists documents (
    id uuid primary key default gen_random_uuid(),
    car_id uuid not null references cars on delete cascade,
    user_id uuid not null references auth.users on delete cascade,
    name text not null,
    expiry_date date not null,
    file_url text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table documents enable row level security;
create policy "Users can view own documents" on documents for
select using (auth.uid() = user_id);
create policy "Users can insert own documents" on documents for
insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on documents for
update using (auth.uid() = user_id);
create policy "Users can delete own documents" on documents for delete using (auth.uid() = user_id);
create index documents_car_id_idx on documents (car_id);
create index documents_user_id_idx on documents (user_id);
-- supports expiry-based queries in the edge function cron and the documents list
create index documents_expiry_date_idx on documents (expiry_date);
create trigger documents_updated_at before
update on documents for each row execute procedure set_updated_at();
-- ─────────────────────────────────────────
-- REMINDERS
-- Covers both maintenance-type reminders and document-expiry reminders.
-- Exactly one of (type_id, document_id) must be set per row.
-- ─────────────────────────────────────────
create table if not exists reminders (
    id uuid primary key default gen_random_uuid(),
    car_id uuid not null references cars on delete cascade,
    user_id uuid not null references auth.users on delete cascade,
    -- maintenance reminder: set type_id, leave document_id null
    type_id text references maintenance_types (id) on delete cascade,
    -- document reminder: set document_id, leave type_id null
    document_id uuid references documents (id) on delete cascade,
    reminder_type text not null default 'push' check (reminder_type in ('push', 'email', 'both')),
    advance_days int not null default 7 check (advance_days > 0),
    advance_km int check (advance_km > 0),
    is_active boolean not null default true,
    last_sent_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    -- enforce that a reminder is for exactly one thing
    constraint reminders_type_xor_document check (num_nonnulls(type_id, document_id) = 1)
);
alter table reminders enable row level security;
create policy "Users can view own reminders" on reminders for
select using (auth.uid() = user_id);
create policy "Users can insert own reminders" on reminders for
insert with check (auth.uid() = user_id);
create policy "Users can update own reminders" on reminders for
update using (auth.uid() = user_id);
create policy "Users can delete own reminders" on reminders for delete using (auth.uid() = user_id);
create index reminders_car_id_idx on reminders (car_id);
create index reminders_user_id_idx on reminders (user_id);
-- partial index: the edge function cron only cares about active reminders
create index reminders_is_active_idx on reminders (user_id)
where is_active = true;
create trigger reminders_updated_at before
update on reminders for each row execute procedure set_updated_at();
-- ─────────────────────────────────────────
-- ODOMETER LOGS
-- Immutable event log — no update or delete policies intentionally.
-- ─────────────────────────────────────────
create table if not exists odometer_logs (
    id uuid primary key default gen_random_uuid(),
    car_id uuid not null references cars on delete cascade,
    user_id uuid not null references auth.users on delete cascade,
    reading int not null check (reading >= 0),
    recorded_at timestamptz not null default now()
);
alter table odometer_logs enable row level security;
create policy "Users can view own odometer logs" on odometer_logs for
select using (auth.uid() = user_id);
create policy "Users can insert own odometer logs" on odometer_logs for
insert with check (auth.uid() = user_id);
create index odometer_logs_car_id_idx on odometer_logs (car_id);
create index odometer_logs_user_id_idx on odometer_logs (user_id);
-- supports the mileage sparkline and avg_daily_km urgency calculation
create index odometer_logs_car_time_idx on odometer_logs (car_id, recorded_at desc);
-- ─────────────────────────────────────────
-- STORAGE BUCKETS
-- avatars  — profile pictures (max 5 MB, images only)
-- documents — car document files (max 20 MB, images + PDF)
-- Both private; users access only their own folder: {user_id}/{filename}
-- ─────────────────────────────────────────
insert into storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
values (
        'avatars',
        'avatars',
        false,
        5242880,
        array ['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'documents',
        'documents',
        false,
        20971520,
        array ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    ) on conflict (id) do nothing;
-- Storage RLS: path pattern is {user_id}/{filename}
-- upsert (replace) requires INSERT + SELECT + UPDATE per Supabase storage behaviour
create policy "avatars: users can upload own" on storage.objects for
insert with check (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "avatars: users can read own" on storage.objects for
select using (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "avatars: users can update own" on storage.objects for
update using (
        bucket_id = 'avatars'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "avatars: users can delete own" on storage.objects for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name)) [1]
);
create policy "documents: users can upload own" on storage.objects for
insert with check (
        bucket_id = 'documents'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "documents: users can read own" on storage.objects for
select using (
        bucket_id = 'documents'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "documents: users can update own" on storage.objects for
update using (
        bucket_id = 'documents'
        and auth.uid()::text = (storage.foldername(name)) [1]
    );
create policy "documents: users can delete own" on storage.objects for delete using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name)) [1]
);