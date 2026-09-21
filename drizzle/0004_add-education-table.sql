CREATE TABLE "education_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"school_name" text NOT NULL,
	"degree" text NOT NULL,
	"field_of_study" text,
	"start_year" integer,
	"end_year" integer,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_entries_start_year_check" CHECK (
        "education_entries"."start_year" IS NULL
        OR "education_entries"."start_year" BETWEEN 1000 AND 9999
      ),
	CONSTRAINT "education_entries_end_year_check" CHECK (
        "education_entries"."end_year" IS NULL
        OR "education_entries"."end_year" BETWEEN 1000 AND 9999
      ),
	CONSTRAINT "education_entries_year_order_check" CHECK (
        "education_entries"."start_year" IS NULL
        OR "education_entries"."end_year" IS NULL
        OR "education_entries"."end_year" >= "education_entries"."start_year"
      ),
	CONSTRAINT "education_entries_current_end_year_check" CHECK (
        "education_entries"."is_current" = false
        OR "education_entries"."end_year" IS NULL
      )
);
--> statement-breakpoint
ALTER TABLE "education_entries" ADD CONSTRAINT "education_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "education_entries_user_id_idx" ON "education_entries" USING btree ("user_id");