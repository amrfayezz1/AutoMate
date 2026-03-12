-- ─────────────────────────────────────────────────────────
-- AutoMate — Initial Schema Migration
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────
-- ─────────────────────────────────────────
-- PROFILES
-- Automatically created on auth.users insert via trigger
-- ─────────────────────────────────────────
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    preferred_language text not null default 'en' check (preferred_language in ('en', 'ar')),
    notifications_enabled boolean not null default true,
    created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for
update using (auth.uid() = id);
-- Trigger: auto-create profile on signup
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$ begin
insert into profiles (id, full_name)
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
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    make text not null,
    model text not null,
    year int not null,
    plate_number text not null,
    current_odometer int not null default 0,
    tracking_mode text not null default 'both' check (tracking_mode in ('time', 'mileage', 'both')),
    created_at timestamptz default now()
);
alter table cars enable row level security;
create policy "Users can view own cars" on cars for
select using (auth.uid() = user_id);
create policy "Users can insert own cars" on cars for
insert with check (auth.uid() = user_id);
create policy "Users can update own cars" on cars for
update using (auth.uid() = user_id);
create policy "Users can delete own cars" on cars for delete using (auth.uid() = user_id);
-- ─────────────────────────────────────────
-- MAINTENANCE TYPES
-- ─────────────────────────────────────────
create table if not exists maintenance_types (
    id text primary key,
    name text not null,
    color text not null,
    is_default boolean not null default true,
    default_interval_days int,
    default_interval_km int,
    sort_order int not null default 0
);
-- No RLS needed: maintenance_types are public read-only
-- Custom user types: stored with user_id, is_default=false
-- Seed default types
insert into maintenance_types (
        id,
        name,
        color,
        default_interval_days,
        default_interval_km,
        sort_order
    )
values (
        'oil-change',
        'Oil Change',
        '#F59E0B',
        90,
        5000,
        0
    ),
    (
        'tires',
        'Tires',
        '#6B7280',
        365,
        10000,
        1
    ),
    (
        'battery',
        'Battery',
        '#3B82F6',
        730,
        30000,
        2
    ),
    (
        'brakes',
        'Brakes',
        '#EF4444',
        365,
        20000,
        3
    ),
    (
        'air-filter',
        'Air Filter',
        '#10B981',
        365,
        15000,
        4
    ),
    (
        'fuel-filter',
        'Fuel Filter',
        '#8B5CF6',
        730,
        30000,
        5
    ),
    (
        'transmission',
        'Transmission',
        '#EC4899',
        730,
        50000,
        6
    ),
    (
        'coolant',
        'Coolant',
        '#06B6D4',
        730,
        40000,
        7
    ),
    (
        'spark-plugs',
        'Spark Plugs',
        '#F97316',
        730,
        30000,
        8
    ),
    (
        'wipers',
        'Wipers',
        '#6366F1',
        365,
        20000,
        9
    ) on conflict (id) do nothing;
-- ─────────────────────────────────────────
-- MAINTENANCE RECORDS
-- ─────────────────────────────────────────
create table if not exists maintenance_records (
    id uuid default gen_random_uuid() primary key,
    car_id uuid references cars on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    type_id text references maintenance_types(id) not null,
    serviced_at date not null,
    mileage_at_service int not null,
    cost numeric(10, 2),
    provider_name text,
    notes text,
    photo_url text,
    next_due_date date,
    next_due_km int,
    created_at timestamptz default now()
);
alter table maintenance_records enable row level security;
create policy "Users can view own maintenance records" on maintenance_records for
select using (auth.uid() = user_id);
create policy "Users can insert own maintenance records" on maintenance_records for
insert with check (auth.uid() = user_id);
create policy "Users can update own maintenance records" on maintenance_records for
update using (auth.uid() = user_id);
create policy "Users can delete own maintenance records" on maintenance_records for delete using (auth.uid() = user_id);
-- ─────────────────────────────────────────
-- REMINDERS
-- ─────────────────────────────────────────
create table if not exists reminders (
    id uuid default gen_random_uuid() primary key,
    car_id uuid references cars on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    type_id text references maintenance_types(id) not null,
    reminder_type text not null default 'push' check (reminder_type in ('push', 'email', 'both')),
    advance_days int not null default 7,
    advance_km int,
    is_active boolean not null default true,
    last_sent_at timestamptz,
    created_at timestamptz default now()
);
alter table reminders enable row level security;
create policy "Users can view own reminders" on reminders for
select using (auth.uid() = user_id);
create policy "Users can insert own reminders" on reminders for
insert with check (auth.uid() = user_id);
create policy "Users can update own reminders" on reminders for
update using (auth.uid() = user_id);
create policy "Users can delete own reminders" on reminders for delete using (auth.uid() = user_id);
-- ─────────────────────────────────────────
-- DOCUMENTS
-- ─────────────────────────────────────────
create table if not exists documents (
    id uuid default gen_random_uuid() primary key,
    car_id uuid references cars on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    expiry_date date not null,
    file_url text,
    notes text,
    created_at timestamptz default now()
);
alter table documents enable row level security;
create policy "Users can view own documents" on documents for
select using (auth.uid() = user_id);
create policy "Users can insert own documents" on documents for
insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on documents for
update using (auth.uid() = user_id);
create policy "Users can delete own documents" on documents for delete using (auth.uid() = user_id);
-- ─────────────────────────────────────────
-- ODOMETER LOGS
-- ─────────────────────────────────────────
create table if not exists odometer_logs (
    id uuid default gen_random_uuid() primary key,
    car_id uuid references cars on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    reading int not null,
    recorded_at timestamptz default now()
);
alter table odometer_logs enable row level security;
create policy "Users can view own odometer logs" on odometer_logs for
select using (auth.uid() = user_id);
create policy "Users can insert own odometer logs" on odometer_logs for
insert with check (auth.uid() = user_id);