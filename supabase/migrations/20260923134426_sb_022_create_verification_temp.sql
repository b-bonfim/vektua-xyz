-- SB-022 temporary verification scaffold; removed by cleanup migration.
create table if not exists public.sb022_verification_temp (
  filename text primary key,
  sku text not null,
  storage_path text not null,
  source_size_bytes bigint not null,
  source_sha256 text not null,
  source_git_blob_sha1 text not null,
  destination_size_bytes bigint,
  destination_sha256 text,
  status text not null,
  verified_at timestamptz not null default now()
);
alter table public.sb022_verification_temp enable row level security;
revoke all on public.sb022_verification_temp from anon, authenticated;
grant select, insert, update, delete on public.sb022_verification_temp to service_role;
