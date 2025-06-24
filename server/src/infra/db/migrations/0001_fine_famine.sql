CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"url_curt" text NOT NULL,
	"visited" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_url_unique" UNIQUE("url"),
	CONSTRAINT "links_url_curt_unique" UNIQUE("url_curt")
);
