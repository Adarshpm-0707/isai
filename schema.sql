-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  phone text,
  address jsonb,
  role text check (role in ('user', 'admin')) default 'user',
  is_active boolean default true,
  created_by uuid references auth.users(id),
  updated_at timestamptz default now()
);

-- 2. CATEGORIES
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- 3. OFFERS
create table if not exists offers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text,
  discount_percent int check (discount_percent >= 0 and discount_percent <= 100),
  is_active boolean default true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz default now()
);

-- 4. PRODUCTS
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  description text,
  price numeric check (price >= 0),
  discount_price numeric,
  original_price numeric,
  offer_price numeric,
  stock int default 0 check (stock >= 0),
  category text,
  category_id uuid references categories(id) on delete set null,
  offer_id uuid references offers(id) on delete set null,
  images text[],
  rating numeric default 0,
  review_count int default 0,
  cost numeric default 0,
  created_at timestamptz default now()
);

-- 5. CART ITEMS
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int check (quantity > 0) default 1,
  size text,
  unique(user_id, product_id)
);

-- 6. WISHLIST
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  unique(user_id, product_id)
);

-- 7. COUPONS
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  type text check (type in ('percentage', 'flat')) not null,
  value numeric not null,
  min_order_amount numeric default 0,
  max_uses int default 0,
  used_count int default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_by uuid references auth.users(id)
);

-- 8. COUPON USAGE
create table if not exists coupon_usage (
  id uuid default gen_random_uuid() primary key,
  coupon_id uuid references coupons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  order_id uuid,
  used_at timestamptz default now(),
  unique(coupon_id, user_id)
);

-- 9. ORDERS
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb,
  subtotal numeric,
  shipping_fee numeric default 0,
  discount_amount numeric default 0,
  cod_fee numeric default 0,
  total numeric not null,
  payment_method text check (payment_method in ('prepaid', 'cod')) default 'prepaid',
  status text check (status in ('pending', 'paid', 'confirmed', 'failed', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  shipping_address jsonb,
  coupon_id uuid references coupons(id),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. REVIEWS
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- 11. STORE REVIEWS
create table if not exists store_reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  rating numeric check (rating >= 1 and rating <= 5),
  comment text,
  image_url text,
  platform text,
  created_at timestamptz default now()
);

-- 12. ADMIN LOGS
create table if not exists admin_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamptz default now()
);

-- 13. PAYMENT SETTINGS
create table if not exists payment_settings (
  id uuid default gen_random_uuid() primary key,
  gateway text default 'razorpay',
  api_key text,
  api_secret text,
  is_active boolean default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz default now()
);

-- 14. CONTACT REQUESTS
create table if not exists contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- FUNCTIONS & TRIGGERS

-- is_admin helper check
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() 
      and role = 'admin' 
      and is_active = true
  );
$$ language sql security definer;

-- handle_new_user trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    avatar_url,
    phone,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(excluded.name, profiles.name);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ENABLE RLS
alter table profiles enable row level security;
alter table categories enable row level security;
alter table offers enable row level security;
alter table products enable row level security;
alter table cart_items enable row level security;
alter table wishlist enable row level security;
alter table coupons enable row level security;
alter table coupon_usage enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table store_reviews enable row level security;
alter table admin_logs enable row level security;
alter table payment_settings enable row level security;
alter table contact_requests enable row level security;

-- RLS POLICIES

-- PROFILES
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins full access on profiles" on profiles for all using (is_admin());

-- PUBLIC SELECT (Products, Categories, Offers, Reviews, Store Reviews)
create policy "Public read products" on products for select using (true);
create policy "Admin all products" on products for all using (is_admin());

create policy "Public read categories" on categories for select using (true);
create policy "Admin all categories" on categories for all using (is_admin());

create policy "Public read offers" on offers for select using (true);
create policy "Admin all offers" on offers for all using (is_admin());

create policy "Public read reviews" on reviews for select using (true);
create policy "Authenticated insert reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "User update/delete own review" on reviews for update using (auth.uid() = user_id);
create policy "Admin all reviews" on reviews for all using (is_admin());

create policy "Public read store_reviews" on store_reviews for select using (true);
create policy "Admin all store_reviews" on store_reviews for all using (is_admin());

-- USER OWNED (Cart, Wishlist, Orders)
create policy "User manage cart" on cart_items for all using (auth.uid() = user_id);
create policy "Admin read/manage cart" on cart_items for all using (is_admin());

create policy "User manage wishlist" on wishlist for all using (auth.uid() = user_id);
create policy "Admin read wishlist" on wishlist for select using (is_admin());

create policy "User view own orders" on orders for select using (auth.uid() = user_id);
create policy "User insert orders" on orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "Admin read/update all orders" on orders for all using (is_admin());

-- COUPONS & USAGE
create policy "Authenticated read active coupons" on coupons for select using (auth.role() = 'authenticated' and is_active = true);
create policy "Admin all coupons" on coupons for all using (is_admin());

create policy "User view own coupon usage" on coupon_usage for select using (auth.uid() = user_id);
create policy "User insert coupon usage" on coupon_usage for insert with check (auth.uid() = user_id);
create policy "Admin all coupon usage" on coupon_usage for all using (is_admin());

-- ADMIN ONLY (Admin logs, Payment settings)
create policy "Admin only logs" on admin_logs for all using (is_admin());
create policy "Admin only payment_settings" on payment_settings for all using (is_admin());

-- CONTACT REQUESTS
create policy "Public insert contact_requests" on contact_requests for insert with check (true);
create policy "Admin all contact_requests" on contact_requests for all using (is_admin());

-- STORAGE (Storage bucket setup instruction comment)
-- Storage Bucket: products (Public Read: true, Admin Write: is_admin())
