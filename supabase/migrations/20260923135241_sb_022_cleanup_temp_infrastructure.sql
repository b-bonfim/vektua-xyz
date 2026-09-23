-- SB-022 cleanup: restore the project to its pre-card extension surface.
drop table if exists public.sb022_verification_temp;
drop extension if exists pg_net;
drop extension if exists http;
