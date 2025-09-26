"use client";

import { useState, useCallback } from 'react';
import { CarImageType } from '@/lib/api/validation';

interface UseCarImagesProps {
  carId?: string;
  initialImages?: CarImageType[];
}

interface UseCarImagesReturn {
  images: CarImageType[];
  newImages: File[];
  primaryImageIndex: number;
  isUploading: boolean;
  error: string | null;
  uploadImages: (files: File[], primaryIndex?: number) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
  setPrimaryImage: (imageId: string) => Promise<void>;
  addNewImages: (files: File[], primaryIndex?: number) => void;
  removeNewImage: (index: number) => void;
  clearError: () => void;
}

export function useCarImages({ carId, initialImages = [] }: UseCarImagesProps): UseCarImagesReturn {
  const [images, setImages] = useState<CarImageType[]>(initialImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addNewImages = useCallback((files: File[], primaryIndex = 0) => {
    // Validate total count
    const totalImages = images.length + files.length;
    if (totalImages > 10) {
      setError(`Maximum 10 images allowed. You can add ${10 - images.length} more images.`);
      return;
    }

    setNewImages(files);
    setPrimaryImageIndex(primaryIndex);
    setError(null);
  }, [images.length]);

  const removeNewImage = useCallback((index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);

    // Adjust primary index if needed
    if (index === primaryImageIndex && updatedNewImages.length > 0) {
      setPrimaryImageIndex(0);
    } else if (index < primaryImageIndex) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  }, [newImages, primaryImageIndex]);

  const uploadImages = useCallback(async (files: File[], primaryIndex = 0) => {
    if (!carId) {
      setError('Car ID is required for uploading images');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      if (primaryIndex !== undefined) {
        formData.append('primaryImageIndex', primaryIndex.toString());
      }

      const response = await fetch(`/api/cars/${carId}/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload images');
      }

      // Update images state with newly uploaded images
      const uploadedImages: CarImageType[] = data.images.map((img: {
        id: string;
        carId: string;
        imageUrl: string;
        isPrimary: boolean;
        createdAt: string;
      }) => ({
        id: img.id,
        carId: img.carId,
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt,
      }));

      setImages(prev => [...prev, ...uploadedImages]);
      setNewImages([]);
      setPrimaryImageIndex(0);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
      console.error('Error uploading images:', err);
    } finally {
      setIsUploading(false);
    }
  }, [carId]);

  const deleteImage = useCallback(async (imageId: string) => {
    if (!carId) {
      setError('Car ID is required for deleting images');
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/cars/${carId}/images?imageIds=${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      // Remove image from state
      setImages(prev => prev.filter(img => img.id !== imageId));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      setError(errorMessage);
      console.error('Error deleting image:', err);
    }
  }, [carId]);

  const setPrimaryImage = useCallback(async (imageId: string) => {
    if (!carId) {
      setError('Car ID is required for setting primary image');
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/cars/${carId}/images`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primaryImageId: imageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set primary image');
      }

      // Update images state
      setImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId,
      })));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set primary image';
      setError(errorMessage);
      console.error('Error setting primary image:', err);
    }
  }, [carId]);

  return {
    images,
    newImages,
    primaryImageIndex,
    isUploading,
    error,
    uploadImages,
    deleteImage,
    setPrimaryImage,
    addNewImages,
    removeNewImage,
    clearError,
  };
}