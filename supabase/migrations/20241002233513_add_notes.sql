alter table "public"."games" add column "notes" text;

CREATE UNIQUE INDEX games_lichess_game_id_key ON public.games USING btree (lichess_game_id);

CREATE UNIQUE INDEX games_url_key ON public.games USING btree (url);

alter table "public"."games" add constraint "games_lichess_game_id_key" UNIQUE using index "games_lichess_game_id_key";

alter table "public"."games" add constraint "games_url_key" UNIQUE using index "games_url_key";

create policy "Enable update for games associated with user's own collections"
on "public"."games"
as permissive
for update
to public
using ((collection_id IN ( SELECT collections.id
   FROM collections
  WHERE (collections.owner_id = ( SELECT auth.uid() AS uid)))));



