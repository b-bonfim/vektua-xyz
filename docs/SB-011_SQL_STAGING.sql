-- SB-011 | Modelar configurações públicas do site | 2026-09-22
-- Source of truth: Trello SB-011. No seed, credentials, payment, frontend changes or cutover.
-- Only four allowlisted, bounded, storefront-oriented keys can be persisted.
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  value_type text not null,
  is_public boolean not null default false,
  is_critical boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_allowed_keys check (
    key in (
      'site.announcement_text',
      'site.whatsapp_button_enabled',
      'site.whatsapp_default_message',
      'site.contact_whatsapp_number'
    )
  ),
  constraint site_settings_valid_types check (
    (value_type = 'text' and jsonb_typeof(value) = 'string')
    or (value_type = 'boolean' and jsonb_typeof(value) = 'boolean')
  ),
  constraint site_settings_key_value_shape check (
    (key = 'site.announcement_text' and value_type = 'text'
      and char_length(btrim(value #>> '{}')) between 1 and 180)
    or (key = 'site.whatsapp_button_enabled' and value_type = 'boolean')
    or (key = 'site.whatsapp_default_message' and value_type = 'text'
      and char_length(btrim(value #>> '{}')) between 1 and 320)
    or (key = 'site.contact_whatsapp_number' and value_type = 'text'
      and (value #>> '{}') ~ '^\+[1-9][0-9]{7,14}$')
  ),
  constraint site_settings_no_obvious_credentials check (
    value::text !~* '(sb_secret_|service_role|password[[:space:]]*[:=]|api[_ -]?key[[:space:]]*[:=]|bearer[[:space:]]+[[:alnum:]_.-]+|-----BEGIN[[:space:]]+.*PRIVATE[[:space:]]+KEY|eyJ[[:alnum:]_-]{20,})'
  ),
  constraint site_settings_no_urls_or_markup check (
    value_type <> 'text' or (value #>> '{}') !~* '(https?://|www\.|[<>])'
  ),
  constraint site_settings_critical_keys check (
    is_critical = (key = 'site.contact_whatsapp_number')
  ),
  constraint site_settings_timestamp_order check (updated_at >= created_at)
);

create function public.site_settings_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := greatest(clock_timestamp(), old.created_at);
  return new;
end;
$$;

create trigger site_settings_touch_updated_at_trg
before update on public.site_settings
for each row execute function public.site_settings_touch_updated_at();

-- Block direct RPC use of this trigger helper by API roles.
revoke all on function public.site_settings_touch_updated_at()
  from public, anon, authenticated;

-- SB-011 is self-contained: SB-012 will review cross-table grants/policies.
-- Revoke Supabase's potentially permissive automatic grants before opt-in read.
alter table public.site_settings enable row level security;
revoke all on table public.site_settings from public, anon, authenticated;

create policy site_settings_storefront_public_read
on public.site_settings
for select
to anon, authenticated
using (is_public = true);

-- Column-level read: public callers cannot SELECT * or inspect critical flags/timestamps.
-- No INSERT, UPDATE, DELETE grants or policies for anon/authenticated.
grant select (key, value, value_type) on table public.site_settings
  to anon, authenticated;

comment on table public.site_settings is
  'SB-011: bounded allowlisted storefront settings; never store tokens, API keys, credentials, personal customer data, payment instructions or arbitrary CMS payloads. All writes are privileged/server-side until explicit Admin Auth/RBAC and audit are implemented.';
comment on column public.site_settings.key is
  'Unique key; additions/shape changes require reviewed, versioned migration and documentation.';
comment on column public.site_settings.value is
  'JSONB scalar only: a validated string or boolean according to the exact key. No arbitrary JSON objects, arrays, URLs, HTML or executable content.';
comment on column public.site_settings.is_public is
  'Explicit opt-in for storefront visibility. False by default; RLS blocks hidden rows.';
comment on column public.site_settings.is_critical is
  'Reserved for extra approval/audit by a future admin service; contact phone is always critical. No client edit grant exists at this stage.';
comment on column public.site_settings.updated_at is
  'Updated automatically by database trigger, not by the storefront.';
