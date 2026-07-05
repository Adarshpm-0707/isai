-- profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user', -- user | admin | superadmin
  created_at timestamp default now()
);

-- products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  stock int default 0,
  category text,
  images text[3],
  created_at timestamp default now()
);

-- orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  total_amount numeric,
  status text default 'pending',
  payment_id text,
  created_at timestamp default now()
);

-- order_items
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  qty int,
  price numeric
);

-- cart_items
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty int default 1
);

-- role check function
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin','superadmin')
  );
$$ language sql security definer;

-- Enable RLS
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;

-- Policies for profiles
create policy "Allow self-read profile" on profiles
  for select using (auth.uid() = id);

create policy "Allow self-update profile" on profiles
  for update using (auth.uid() = id);

create policy "Allow admin full profile" on profiles
  for all using (is_admin());

-- Policies for products
create policy "Allow public read products" on products
  for select using (true);

create policy "Allow admin write products" on products
  for all using (is_admin());

-- Policies for orders
create policy "Allow user read orders" on orders
  for select using (auth.uid() = user_id);

create policy "Allow user insert orders" on orders
  for insert with check (auth.uid() = user_id);

create policy "Allow admin full orders" on orders
  for all using (is_admin());

-- Policies for order_items
create policy "Allow user read order_items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Allow user insert order_items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Allow admin full order_items" on order_items
  for all using (is_admin());

-- Policies for cart_items
create policy "Allow user manage cart_items" on cart_items
  for all using (auth.uid() = user_id);

create policy "Allow admin manage cart_items" on cart_items
  for all using (is_admin());

-- Automatically create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
