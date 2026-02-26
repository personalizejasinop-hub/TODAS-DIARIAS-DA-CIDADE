-- Atualiza handle_new_user para aceitar full_name do Google OAuth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, phone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1),
      ''
    ),
    coalesce(new.raw_user_meta_data ->> 'email', new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'candidato'),
    coalesce(new.raw_user_meta_data ->> 'phone', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
