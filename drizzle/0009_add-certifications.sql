CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issue_year" integer,
	"credential_id" text,
	"credential_url" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certifications_issue_year_check" CHECK (
        "certifications"."issue_year" IS NULL
        OR "certifications"."issue_year" BETWEEN 1000 AND 9999
      )
);
--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "certifications_user_id_idx" ON "certifications" USING btree ("user_id");