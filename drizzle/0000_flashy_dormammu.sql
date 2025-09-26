CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"car_id" uuid NOT NULL,
	"renter_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"pickup_location" text,
	"dropoff_location" text,
	"special_requests" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"car_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"document_url" text NOT NULL,
	"expiry_date" timestamp,
	"status" text NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"review_notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "car_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"car_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"plate_number" text NOT NULL,
	"vin" text,
	"fuel_type" text NOT NULL,
	"transmission" text NOT NULL,
	"seats" integer NOT NULL,
	"category" text NOT NULL,
	"daily_rate" numeric(10, 2) NOT NULL,
	"description" text,
	"features" text,
	"location" text NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_available" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cars_plate_number_unique" UNIQUE("plate_number"),
	CONSTRAINT "cars_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"car_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"paystack_reference" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" text NOT NULL,
	"payment_method" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_paystack_reference_unique" UNIQUE("paystack_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"reviewed_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"review_type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"date_of_birth" timestamp,
	"drivers_license_number" text,
	"drivers_license_expiry" timestamp,
	"profile_image" text,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"document_url" text NOT NULL,
	"status" text NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"review_notes" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_users_id_fk" FOREIGN KEY ("renter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car_documents" ADD CONSTRAINT "car_documents_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "car_images" ADD CONSTRAINT "car_images_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cars" ADD CONSTRAINT "cars_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorites" ADD CONSTRAINT "favorites_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewed_id_users_id_fk" FOREIGN KEY ("reviewed_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_car_idx" ON "bookings" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_renter_idx" ON "bookings" USING btree ("renter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "car_docs_car_idx" ON "car_documents" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "car_docs_status_idx" ON "car_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "car_images_car_idx" ON "car_images" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "owner_idx" ON "cars" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_idx" ON "cars" USING btree ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "available_idx" ON "cars" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorites_user_idx" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorites_car_idx" ON "favorites" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_unread_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_booking_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payments_reference_idx" ON "payments" USING btree ("paystack_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_booking_idx" ON "reviews" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_reviewed_idx" ON "reviews" USING btree ("reviewed_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_docs_user_idx" ON "verification_documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_docs_status_idx" ON "verification_documents" USING btree ("status");