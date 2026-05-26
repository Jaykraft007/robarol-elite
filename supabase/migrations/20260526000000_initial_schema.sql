create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'admin' check (role = 'admin'),
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.listings (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category text not null check (category in ('automobiles', 'yachts', 'properties')),
    status text not null check (status in ('available', 'coming_soon', 'sold', 'hidden')),
    price numeric(14,2) not null check (price >= 0),
    short_description text not null,
    featured boolean not null default false,
    show_on_website boolean not null default true,
    inquiry_label text not null check (inquiry_label in ('Send Inquiry', 'Register Interest', 'Similar Inquiry')),
    specs jsonb not null default '{}'::jsonb,
    main_image_url text not null,
    gallery_images text[] not null default '{}',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid references public.listings(id) on delete set null,
    full_name text not null,
    email text not null,
    phone text not null,
    location text not null,
    message text not null,
    source text not null check (source in ('contact_page', 'listing_modal')),
    status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row
execute procedure public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row
execute procedure public.set_updated_at();

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row
execute procedure public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.listings enable row level security;
alter table public.inquiries enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
as $$
    select exists (
        select 1
        from public.admin_users
        where id = auth.uid()
          and role = 'admin'
          and is_active = true
    );
$$;

drop policy if exists "Public can view visible listings" on public.listings;
create policy "Public can view visible listings"
on public.listings
for select
using (show_on_website = true and status <> 'hidden');

drop policy if exists "Admins can manage listings" on public.listings;
create policy "Admins can manage listings"
on public.listings
for all
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries"
on public.inquiries
for select
using (public.is_active_admin());

drop policy if exists "Admins can manage inquiries" on public.inquiries;
create policy "Admins can manage inquiries"
on public.inquiries
for all
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "Admins can view own admin user record" on public.admin_users;
create policy "Admins can view own admin user record"
on public.admin_users
for select
using (auth.uid() = id);

drop policy if exists "Admins can update own admin user record" on public.admin_users;
create policy "Admins can update own admin user record"
on public.admin_users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view listing images" on storage.objects;
create policy "Public can view listing images"
on storage.objects
for select
using (bucket_id = 'listing-images');

drop policy if exists "Admins can manage listing images" on storage.objects;
create policy "Admins can manage listing images"
on storage.objects
for all
using (bucket_id = 'listing-images' and public.is_active_admin())
with check (bucket_id = 'listing-images' and public.is_active_admin());
