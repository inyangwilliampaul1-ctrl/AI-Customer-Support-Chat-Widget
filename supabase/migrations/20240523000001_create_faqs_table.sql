create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table faqs enable row level security;

-- Policy: Users can view FAQs for their own business
create policy "Users can view their own business faqs"
on faqs
for select
using (
  business_id in (
    select id from businesses where user_id = auth.uid()
  )
);

-- Policy: Users can insert FAQs for their own business
create policy "Users can insert their own business faqs"
on faqs
for insert
with check (
  business_id in (
    select id from businesses where user_id = auth.uid()
  )
);

-- Policy: Users can update APIs for their own business
create policy "Users can update their own business faqs"
on faqs
for update
using (
  business_id in (
    select id from businesses where user_id = auth.uid()
  )
);

-- Policy: Users can delete FAQs for their own business
create policy "Users can delete their own business faqs"
on faqs
for delete
using (
  business_id in (
    select id from businesses where user_id = auth.uid()
  )
);
