'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vin: string;
  fuelType: string;
  transmission: string;
  seats: number;
  category: string;
  dailyRate: number;
  description: string;
  features: string[];
  location: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  averageRating?: number;
  totalReviews?: number;
}

export interface CarsListResponse {
  cars: Car[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface CarsFilters {
  page?: number;
  limit?: number;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  search?: string;
}

export function useCars(filters: CarsFilters = {}) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async (): Promise<CarsListResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/cars?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      return response.json();
    },
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async (): Promise<Car> => {
      const response = await fetch(`/api/cars/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Car>): Promise<Car> => {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create car');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Car> }): Promise<Car> => {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update car');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', data.id] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete car');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}