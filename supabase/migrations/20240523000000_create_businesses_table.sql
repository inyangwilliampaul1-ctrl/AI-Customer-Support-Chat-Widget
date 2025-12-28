create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table businesses enable row level security;

-- Policy: users can view their own business
create policy "Users can view their own business"
on businesses
for select
using (auth.uid() = user_id);

-- Policy: users can create their own business
create policy "Users can create their own business"
on businesses
for insert
with check (auth.uid() = user_id);

-- Policy: users can update their own business
create policy "Users can update their own business"
on businesses
for update
using (auth.uid() = user_id);
