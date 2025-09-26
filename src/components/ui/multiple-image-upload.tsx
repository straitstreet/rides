"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface MultipleImageUploadProps {
  onImagesChange: (files: File[], primaryIndex?: number) => void;
  maxImages?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  existingImages?: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  disabled?: boolean;
  className?: string;
}

export function MultipleImageUpload({
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  existingImages = [],
  disabled = false,
  className,
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createImageFile = useCallback((file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    id: Math.random().toString(36).substr(2, 9),
  }), []);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `${file.name}: Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `${file.name}: File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }
    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFiles = useCallback((files: FileList) => {
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Check total count
    const totalCount = images.length + existingImages.length + files.length;
    if (totalCount > maxImages) {
      newErrors.push(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length - existingImages.length} more.`);
      setErrors(newErrors);
      return;
    }

    // Validate each file
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create image objects
    const newImages = validFiles.map(createImageFile);
    const updatedImages = [...images, ...newImages];

    setImages(updatedImages);
    setErrors([]);

    // Notify parent
    const allFiles = updatedImages.map(img => img.file);
    onImagesChange(allFiles, primaryIndex);
  }, [images, existingImages.length, maxImages, validateFile, createImageFile, onImagesChange, primaryIndex]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files?.length) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFiles(files);
    }
    // Reset input value to allow same file selection
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = useCallback((imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    const removedIndex = images.findIndex(img => img.id === imageId);

    // Update primary index if needed
    let newPrimaryIndex = primaryIndex;
    if (removedIndex === primaryIndex) {
      newPrimaryIndex = 0; // Reset to first image
    } else if (removedIndex < primaryIndex) {
      newPrimaryIndex = primaryIndex - 1;
    }

    setImages(updatedImages);
    setPrimaryIndex(newPrimaryIndex);

    // Clean up object URL
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Notify parent
    const allFiles = updatedImages.map(img => img.file);
    onImagesChange(allFiles, newPrimaryIndex);
  }, [images, primaryIndex, onImagesChange]);

  const setPrimary = useCallback((index: number) => {
    setPrimaryIndex(index);
    const allFiles = images.map(img => img.file);
    onImagesChange(allFiles, index);
  }, [images, onImagesChange]);

  const totalImages = images.length + existingImages.length;
  const canAddMore = totalImages < maxImages && !disabled;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled}
          />

          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop images here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Upload up to {maxImages} images (max {Math.round(maxFileSize / (1024 * 1024))}MB each)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {totalImages}/{maxImages} images uploaded
          </p>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Current Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0 relative group">
                  <Image
                    src={image.url}
                    alt={`Car image ${index + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {/* Handle existing image deletion */}}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Images Preview */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">New Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0 relative group">
                  <Image
                    src={image.preview}
                    width={200}
                    height={150}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />

                  {/* Primary indicator */}
                  {index === primaryIndex && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setPrimary(index)}
                      disabled={index === primaryIndex}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                    <p className="truncate">{image.file.name}</p>
                    <p>{(image.file.size / (1024 * 1024)).toFixed(1)}MB</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalImages === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}