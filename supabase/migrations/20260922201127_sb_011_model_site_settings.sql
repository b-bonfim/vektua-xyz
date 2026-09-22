create table public.site_settings (
 key text primary key,
 value jsonb not null,
 value_type text not null,
 is_public boolean not null default false,
 is_critical boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint site_settings_allowed_keys check (key in ('site.announcement_text','site.whatsapp_button_enabled','site.whatsapp_default_message','site.contact_whatsapp_number')),
 constraint site_settings_valid_types check ((value_type = 'text' and jsonb_typeof(value) = 'string') or (value_type = 'boolean' and jsonb_typeof(value) = 'boolean')),
 constraint site_settings_key_value_shape check (
  (key = 'site.announcement_text' and value_type = 'text' and char_length(btrim(value #>> '{}')) between 1 and 180)
  or (key = 'site.whatsapp_button_enabled' and value_type = 'boolean')
  or (key = 'site.whatsapp_default_message' and value_type = 'text' and char_length(btrim(value #>> '{}')) between 1 and 320)
  or (key = 'site.contact_whatsapp_number' and value_type = 'text' and (value #>> '{}') ~ '^\+[1-9][0-9]{7,14}$')
 ),
 constraint site_settings_no_urls_or_markup check (value_type <> 'text' or (value #>> '{}') !~* '(https?://|www\.|[<>])'),
 constraint site_settings_critical_keys check (is_critical = (key = 'site.contact_whatsapp_number')),
 constraint site_settings_timestamp_order check (updated_at >= created_at)
);
create function public.site_settings_touch_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
 new.created_at := old.created_at;
 new.updated_at := greatest(clock_timestamp(), old.created_at);
 return new;
end;
$$;
create trigger site_settings_touch_updated_at_trg before update on public.site_settings for each row execute function public.site_settings_touch_updated_at();
revoke all on function public.site_settings_touch_updated_at() from public, anon, authenticated;
alter table public.site_settings enable row level security;
revoke all on table public.site_settings from public, anon, authenticated;
create policy site_settings_storefront_public_read on public.site_settings for select to anon, authenticated using (is_public = true);
grant select (key, value, value_type) on table public.site_settings to anon, authenticated;
comment on table public.site_settings is 'SB-011 allowlisted public storefront settings. Never store credentials, tokens, customer personal data or payment instructions. Admin writes require future authorization and audit.';
comment on column public.site_settings.is_public is 'Explicit public opt-in; false by default, enforced by RLS.';
comment on column public.site_settings.is_critical is 'Critical contact number requires future admin change authorization and audit; no client write grants exist.';