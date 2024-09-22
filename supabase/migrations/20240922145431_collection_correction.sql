alter table "public"."collections" alter column "id" set default gen_random_uuid();

alter table "public"."collections" alter column "name" set not null;

alter table "public"."collections" alter column "owner" set default auth.uid();

alter table "public"."collections" alter column "owner" drop not null;

create policy "Enable insert for users based on owner"
on "public"."collections"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = owner));



