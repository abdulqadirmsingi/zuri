CREATE TABLE "install_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component" text NOT NULL,
	"version" text,
	"tier" text NOT NULL,
	"country" text,
	"source" text NOT NULL,
	"visitor_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "install_events_component_created_idx" ON "install_events" USING btree ("component","created_at");--> statement-breakpoint
CREATE INDEX "install_events_visitor_component_idx" ON "install_events" USING btree ("visitor_hash","component");