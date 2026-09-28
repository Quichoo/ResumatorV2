CREATE TABLE "resume_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"profile_snapshot" jsonb NOT NULL,
	"job_snapshot" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"generated_draft" jsonb,
	"failure_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	CONSTRAINT "resume_generations_status_check" CHECK ("resume_generations"."status" IN ('pending', 'running', 'completed', 'failed')),
	CONSTRAINT "resume_generations_schema_version_check" CHECK ("resume_generations"."schema_version" >= 1),
	CONSTRAINT "resume_generations_result_check" CHECK (
        (
          "resume_generations"."status" IN ('pending', 'running')
          AND "resume_generations"."generated_draft" IS NULL
          AND "resume_generations"."failure_code" IS NULL
          AND "resume_generations"."finished_at" IS NULL
        )
        OR
        (
          "resume_generations"."status" = 'completed'
          AND "resume_generations"."generated_draft" IS NOT NULL
          AND "resume_generations"."failure_code" IS NULL
          AND "resume_generations"."finished_at" IS NOT NULL
        )
        OR
        (
          "resume_generations"."status" = 'failed'
          AND "resume_generations"."generated_draft" IS NULL
          AND "resume_generations"."failure_code" IS NOT NULL
          AND "resume_generations"."finished_at" IS NOT NULL
        )
      )
);
--> statement-breakpoint
ALTER TABLE "resume_generations" ADD CONSTRAINT "resume_generations_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resume_generations_resume_id_created_at_idx" ON "resume_generations" USING btree ("resume_id","created_at");