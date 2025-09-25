export const sampleCars = [
  {
    id: '1',
    name: 'Toyota Camry 2022',
    location: 'Lekki, Lagos',
    price: 15000,
    rating: 4.5, // Calculated from 2 reviews: (5+4)/2 = 4.5
    reviewCount: 2,
    features: ['Automatic', '4 Seats', 'Petrol', 'AC', 'Bluetooth'],
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    category: 'mid-size',
    description: 'Comfortable and reliable sedan perfect for city driving and long trips.'
  },
  {
    id: '2',
    name: 'Honda Accord 2021',
    location: 'Wuse, Abuja',
    price: 18000,
    rating: 5.0, // Calculated from 2 reviews: (5+5)/2 = 5.0
    reviewCount: 2,
    features: ['Automatic', '4 Seats', 'Petrol', 'AC', 'GPS'],
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    category: 'mid-size',
    description: 'Premium sedan with excellent fuel efficiency and modern features.'
  },
  {
    id: '3',
    name: 'Lexus RX 2023',
    location: 'GRA, Port Harcourt',
    price: 35000,
    rating: 5.0, // Calculated from 1 review: 5/1 = 5.0
    reviewCount: 1,
    features: ['Automatic', '7 Seats', 'Hybrid', 'AC', 'Premium Sound'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
    make: 'Lexus',
    model: 'RX',
    year: 2023,
    category: 'luxury',
    description: 'Luxury SUV with hybrid technology and spacious interior.'
  },
  {
    id: '4',
    name: 'Kia Rio 2020',
    location: 'Ikeja, Lagos',
    price: 12000,
    rating: 4.5, // Calculated from 2 reviews: (4+5)/2 = 4.5
    reviewCount: 2,
    features: ['Manual', '4 Seats', 'Petrol', 'AC'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
    make: 'Kia',
    model: 'Rio',
    year: 2020,
    category: 'economy',
    description: 'Economical and efficient compact car, perfect for city commuting.'
  },
  {
    id: '5',
    name: 'Mercedes-Benz GLE 2022',
    location: 'Victoria Island, Lagos',
    price: 45000,
    rating: 4.9,
    reviewCount: 0,
    features: ['Automatic', '7 Seats', 'Petrol', 'AC', 'Leather', 'Sunroof'],
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2022,
    category: 'luxury',
    description: 'Premium luxury SUV with advanced safety features and comfort.'
  },
  {
    id: '6',
    name: 'Hyundai Elantra 2021',
    location: 'Garki, Abuja',
    price: 16000,
    rating: 4.7,
    reviewCount: 0,
    features: ['Automatic', '4 Seats', 'Petrol', 'AC', 'Backup Camera'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2021,
    category: 'compact',
    description: 'Stylish and feature-rich compact sedan with great value.'
  }
];

export const nigerianCities = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Jos',
  'Ilorin',
  'Owerri',
  'Calabar',
  'Enugu',
  'Kaduna',
  'Zaria',
  'Warri',
  'Akure'
];

export const carCategories = [
  { id: 'economy', name: 'Economy', description: 'Budget-friendly cars for everyday use' },
  { id: 'compact', name: 'Compact', description: 'Small cars perfect for city driving' },
  { id: 'mid-size', name: 'Mid-size', description: 'Comfortable cars for longer trips' },
  { id: 'full-size', name: 'Full-size', description: 'Spacious cars for groups' },
  { id: 'luxury', name: 'Luxury', description: 'Premium vehicles with premium features' },
  { id: 'suv', name: 'SUV', description: 'Sport utility vehicles for any terrain' }
];

export const carFeatures = [
  'AC', 'Bluetooth', 'GPS', 'Backup Camera', 'Leather Seats',
  'Sunroof', 'Premium Sound', 'USB Charging', 'Keyless Entry',
  'Automatic', 'Manual', 'Hybrid', 'Electric'
];

// Sample reviews data
export const sampleReviews = [
  {
    id: 'r1',
    carId: '1',
    userId: 'u1',
    userName: 'Adebayo Ogundimu',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Excellent car and service!',
    content: 'The Toyota Camry was in pristine condition. Very comfortable for my Lagos to Ibadan trip. The owner was responsive and pickup was smooth. Highly recommend!',
    createdAt: new Date('2024-01-15'),
    verified: true,
    helpful: 12
  },
  {
    id: 'r2',
    carId: '1',
    userId: 'u2',
    userName: 'Fatima Mohammed',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    title: 'Great value for money',
    content: 'Used this car for a week in Lagos. Good fuel economy and comfortable seats. Only minor issue was the AC took a while to cool down, but overall very satisfied.',
    createdAt: new Date('2024-01-10'),
    verified: true,
    helpful: 8
  },
  {
    id: 'r3',
    carId: '2',
    userId: 'u3',
    userName: 'Chioma Okwu',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Perfect for business trips',
    content: 'The Honda Accord was exactly what I needed for my Abuja business meetings. Clean, comfortable, and reliable. The GPS worked perfectly too.',
    createdAt: new Date('2024-01-20'),
    verified: true,
    helpful: 15
  },
  {
    id: 'r4',
    carId: '2',
    userId: 'u4',
    userName: 'Emeka Nwankwo',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Outstanding experience',
    content: 'This is my third time renting from this platform. The Honda was spotless and drove like a dream. Great customer service from start to finish.',
    createdAt: new Date('2024-01-08'),
    verified: true,
    helpful: 10
  },
  {
    id: 'r5',
    carId: '3',
    userId: 'u5',
    userName: 'Aisha Bello',
    userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Luxury at its finest',
    content: 'The Lexus RX was absolutely perfect for our family vacation in Port Harcourt. Spacious, comfortable, and loaded with features. Worth every naira!',
    createdAt: new Date('2024-01-25'),
    verified: true,
    helpful: 18
  },
  {
    id: 'r6',
    carId: '4',
    userId: 'u6',
    userName: 'Olumide Adeyemi',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    title: 'Good budget option',
    content: 'The Kia Rio is perfect for city driving. Compact, easy to park, and fuel efficient. Great for the price point.',
    createdAt: new Date('2024-01-12'),
    verified: true,
    helpful: 6
  },
  {
    id: 'r7',
    carId: '4',
    userId: 'u7',
    userName: 'Grace Ikechukwu',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Exceeded expectations',
    content: 'Despite being the most affordable option, this car was clean, reliable, and perfect for my daily commute during my Lagos stay.',
    createdAt: new Date('2024-01-05'),
    verified: true,
    helpful: 9
  }
];

// Helper function to get reviews for a specific car
export const getCarReviews = (carId: string) => {
  return sampleReviews.filter(review => review.carId === carId);
};

// Helper function to calculate average rating for a car
export const getCarAverageRating = (carId: string) => {
  const reviews = getCarReviews(carId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Helper function to get review summary for a car
export const getCarReviewSummary = (carId: string) => {
  const reviews = getCarReviews(carId);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach(review => {
    breakdown[review.rating as keyof typeof breakdown]++;
  });

  return {
    averageRating: getCarAverageRating(carId),
    totalReviews: reviews.length,
    ratingBreakdown: breakdown
  };
};