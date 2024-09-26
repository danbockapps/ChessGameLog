alter table "public"."games" drop column "opponent";

alter table "public"."games" add column "black_rating" numeric;

alter table "public"."games" add column "black_result" text;

alter table "public"."games" add column "black_username" text;

alter table "public"."games" add column "clock_increment" numeric;

alter table "public"."games" add column "clock_initial" numeric;

alter table "public"."games" add column "lichess_game_id" text;

alter table "public"."games" add column "white_rating" numeric;

alter table "public"."games" add column "white_result" text;

alter table "public"."games" add column "white_username" text;

alter table "public"."games" add column "winner" text;


