-- Keep the admin authorization and return type; expand the row into its columns.
-- SELECT b produces one composite column and raises 42804 even for an empty list.
create or replace function public.admin_list_banners()
returns setof public.banners
language plpgsql security definer set search_path = public, auth
as $$
begin
  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'PLATFORM_ADMIN' and p.status = 'ACTIVE'
  ) then
    raise exception 'FORBIDDEN';
  end if;
  return query select b.* from public.banners b order by b.sort_order, b.created_at, b.id;
end;
$$;

revoke all on function public.admin_list_banners() from public, anon;
grant execute on function public.admin_list_banners() to authenticated;
