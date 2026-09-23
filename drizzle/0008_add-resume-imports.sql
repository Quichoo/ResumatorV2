CREATE TABLE "resume_imports" (
	"user_id" text NOT NULL,
	"request_id" uuid NOT NULL,
	"payload_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resume_imports_user_id_request_id_pk" PRIMARY KEY("user_id","request_id")
);
--> statement-breakpoint
ALTER TABLE "resume_imports" ADD CONSTRAINT "resume_imports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;