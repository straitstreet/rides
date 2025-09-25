import { pgTable, text, timestamp, decimal, integer, boolean, uuid, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').unique(),
  dateOfBirth: timestamp('date_of_birth'),
  driversLicenseNumber: text('drivers_license_number'),
  driversLicenseExpiry: timestamp('drivers_license_expiry'),
  profileImage: text('profile_image'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cars = pgTable('cars', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  plateNumber: text('plate_number').unique().notNull(),
  vin: text('vin').unique(),
  fuelType: text('fuel_type').notNull(), // petrol, diesel, hybrid, electric
  transmission: text('transmission').notNull(), // manual, automatic
  seats: integer('seats').notNull(),
  category: text('category').notNull(), // economy, compact, mid-size, full-size, luxury, suv
  dailyRate: decimal('daily_rate', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  features: text('features'), // JSON string of features array
  location: text('location').notNull(), // city/area in Nigeria
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isAvailable: boolean('is_available').default(true),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  ownerIdx: index('owner_idx').on(table.ownerId),
  locationIdx: index('location_idx').on(table.location),
  availableIdx: index('available_idx').on(table.isAvailable),
}));

export const carImages = pgTable('car_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  carId: uuid('car_id').references(() => cars.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  carIdx: index('car_images_car_idx').on(table.carId),
}));

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  carId: uuid('car_id').references(() => cars.id).notNull(),
  renterId: uuid('renter_id').references(() => users.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(), // pending, confirmed, active, completed, cancelled
  pickupLocation: text('pickup_location'),
  dropoffLocation: text('dropoff_location'),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  carIdx: index('bookings_car_idx').on(table.carId),
  renterIdx: index('bookings_renter_idx').on(table.renterId),
  statusIdx: index('bookings_status_idx').on(table.status),
}));

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  paystackReference: text('paystack_reference').unique().notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(), // pending, success, failed
  paymentMethod: text('payment_method'), // card, bank_transfer, ussd
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  bookingIdx: index('payments_booking_idx').on(table.bookingId),
  referenceIdx: index('payments_reference_idx').on(table.paystackReference),
}));

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  reviewedId: uuid('reviewed_id').references(() => users.id).notNull(), // car owner or renter
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  reviewType: text('review_type').notNull(), // renter_review, owner_review
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  bookingIdx: index('reviews_booking_idx').on(table.bookingId),
  reviewedIdx: index('reviews_reviewed_idx').on(table.reviewedId),
}));

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // booking, payment, review, system
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  unreadIdx: index('notifications_unread_idx').on(table.isRead),
}));

export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  carId: uuid('car_id').references(() => cars.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('favorites_user_idx').on(table.userId),
  carIdx: index('favorites_car_idx').on(table.carId),
}));

export const verificationDocuments = pgTable('verification_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  documentType: text('document_type').notNull(), // drivers_license, national_id, passport
  documentUrl: text('document_url').notNull(),
  status: text('status').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
}, (table) => ({
  userIdx: index('verification_docs_user_idx').on(table.userId),
  statusIdx: index('verification_docs_status_idx').on(table.status),
}));

export const carDocuments = pgTable('car_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  carId: uuid('car_id').references(() => cars.id, { onDelete: 'cascade' }).notNull(),
  documentType: text('document_type').notNull(), // vehicle_license, insurance, roadworthiness
  documentUrl: text('document_url').notNull(),
  expiryDate: timestamp('expiry_date'),
  status: text('status').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
}, (table) => ({
  carIdx: index('car_docs_car_idx').on(table.carId),
  statusIdx: index('car_docs_status_idx').on(table.status),
}));