drop policy "Enable insert for users based on owner" on "public"."collections";

alter table "public"."collections" drop constraint "collections_owner_fkey";

alter table "public"."games" drop constraint "games_collection_fkey";

alter table "public"."collections" drop column "owner";

alter table "public"."collections" add column "last_refreshed" timestamp with time zone;

alter table "public"."collections" add column "owner_id" uuid default auth.uid();

alter table "public"."games" drop column "collection";

alter table "public"."games" drop column "pgn";

alter table "public"."games" add column "collection_id" uuid;

alter table "public"."games" add column "eco" text;

alter table "public"."games" add column "fen" text;

alter table "public"."games" add column "game_dttm" timestamp with time zone;

alter table "public"."games" add column "opponent" text;

alter table "public"."games" add column "site" site_type;

alter table "public"."games" add column "time_control" text;

alter table "public"."collections" add constraint "collections_owner_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_owner_fkey";

alter table "public"."games" add constraint "games_collection_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) not valid;

alter table "public"."games" validate constraint "games_collection_fkey";

create policy "Enable update for user based on owner"
on "public"."collections"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable insert for games associated with user's own collections"
on "public"."games"
as permissive
for insert
to public
with check ((collection_id IN ( SELECT collections.id
   FROM collections
  WHERE (collections.owner_id = ( SELECT auth.uid() AS uid)))));


create policy "Enable insert for users based on owner"
on "public"."collections"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = owner_id));



