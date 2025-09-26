import { z } from 'zod';

// Car validation schemas
export const createCarSchema = z.object({
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required').max(30),
  plateNumber: z.string().min(1, 'Plate number is required').max(20),
  vin: z.string().optional(),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  transmission: z.enum(['manual', 'automatic']),
  seats: z.number().int().min(1).max(20),
  category: z.enum(['economy', 'compact', 'mid-size', 'full-size', 'luxury', 'suv']),
  dailyRate: z.number().positive('Daily rate must be positive'),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateCarSchema = createCarSchema.partial();

export const carQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  location: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  available: z.string().optional().transform(val => val === 'true'),
});

// User validation schemas
export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().datetime().optional(),
});

// Booking validation schemas
export const createBookingSchema = z.object({
  carId: z.string().uuid('Invalid car ID'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  specialRequests: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled']).optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const bookingQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  status: z.string().optional(),
  carId: z.string().uuid().optional(),
  renterId: z.string().uuid().optional(),
});

// Review validation schemas
export const createReviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  reviewedId: z.string().uuid('Invalid reviewed user ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  reviewType: z.enum(['renter_review', 'owner_review']),
});

export const reviewQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  reviewedId: z.string().uuid().optional(),
  reviewType: z.string().optional(),
});

// Payment validation schemas
export const createPaymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  paystackReference: z.string().min(1, 'Payment reference is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['card', 'bank_transfer', 'ussd']).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  folder: z.string().optional(),
});

// Multiple image upload validation (max 10 images)
export const multipleImageUploadSchema = z.object({
  images: z.array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .refine(
      (files) => files.every(file =>
        file.type.startsWith('image/') &&
        file.size <= 5 * 1024 * 1024 // 5MB per image
      ),
      'All files must be images under 5MB'
    ),
  carId: z.string().uuid('Invalid car ID').optional(),
  primaryImageIndex: z.number().int().min(0).max(9).optional(),
});

// Car image management
export const carImageSchema = z.object({
  id: z.string().uuid(),
  carId: z.string().uuid(),
  imageUrl: z.string().url(),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime(),
});

export const updateCarImagesSchema = z.object({
  imagesToDelete: z.array(z.string().uuid()).optional(),
  newImages: z.array(z.instanceof(File)).max(10).optional(),
  primaryImageId: z.string().uuid().optional(),
}).refine(
  (data) => {
    // Ensure we don't exceed 10 images total
    const newCount = data.newImages?.length || 0;
    return newCount <= 10; // Will be validated against existing count in endpoint
  },
  'Total images cannot exceed 10'
);

// Pagination helpers
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
export type CarQueryInput = z.infer<typeof carQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type MultipleImageUploadInput = z.infer<typeof multipleImageUploadSchema>;
export type CarImageType = z.infer<typeof carImageSchema>;
export type UpdateCarImagesInput = z.infer<typeof updateCarImagesSchema>;