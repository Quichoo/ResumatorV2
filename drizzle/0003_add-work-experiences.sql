CREATE TABLE "work_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"job_title" text NOT NULL,
	"company_name" text NOT NULL,
	"location" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_experiences_date_order_check" CHECK ("work_experiences"."end_date" IS NULL OR "work_experiences"."end_date" >= "work_experiences"."start_date"),
	CONSTRAINT "work_experiences_current_end_date_check" CHECK ((
        ("work_experiences"."is_current" = true AND "work_experiences"."end_date" IS NULL)
        OR
        ("work_experiences"."is_current" = false AND "work_experiences"."end_date" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "work_experiences_user_id_idx" ON "work_experiences" USING btree ("user_id");