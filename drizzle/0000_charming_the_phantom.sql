CREATE TABLE "saved_videos" (
	"video_id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"added_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "srs_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"word_id" text NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"interval" integer DEFAULT 0,
	"ease_factor" real DEFAULT 2.5,
	"repetitions" integer DEFAULT 0,
	"next_review_date" text NOT NULL,
	"last_reviewed_at" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcript_cache" (
	"video_id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"data" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary" (
	"word_id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"encounter_count" integer DEFAULT 1,
	"added_at" text NOT NULL,
	"last_reviewed_at" text
);
