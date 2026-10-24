-- Used only before historical demo migrations in the disposable CI database.
insert into public.companies (id, legal_name, display_name)
values ('00000000-0000-0000-0000-000000000001', 'Empresa Demo Ltda.', 'Empresa Demo')
on conflict (id) do nothing;
insert into public.inventory_locations (id, name)
values ('00000000-0000-0000-0000-000000000501', 'Centro de distribuição demo')
on conflict (id) do nothing;
