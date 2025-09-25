'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  carId: string;
  onSubmit?: (review: {
    rating: number;
    title: string;
    content: string;
    carId: string;
  }) => void;
  onCancel?: () => void;
}

export function ReviewForm({ carId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.({
        rating,
        title: title.trim(),
        content: content.trim(),
        carId
      });

      // Reset form
      setRating(0);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starIndex = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
            starIndex <= (hoveredRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => setRating(starIndex)}
          onMouseEnter={() => setHoveredRating(starIndex)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${starIndex} out of 5 stars`}
        >
          <Star
            className={`h-8 w-8 ${
              starIndex <= (hoveredRating || rating)
                ? 'fill-yellow-400'
                : ''
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Rating</Label>
            <div className="flex space-x-1" role="radiogroup" aria-label="Rating">
              {renderStarRating()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You rated this {rating} out of 5 stars
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="review-title" className="text-sm font-medium">
              Review Title
            </Label>
            <Input
              id="review-title"
              type="text"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="mt-2"
              aria-describedby="title-help"
            />
            <p id="title-help" className="text-xs text-muted-foreground mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="review-content" className="text-sm font-medium">
              Your Review
            </Label>
            <Textarea
              id="review-content"
              placeholder="Tell others about your experience with this car..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              className="mt-2 resize-none"
              aria-describedby="content-help"
            />
            <p id="content-help" className="text-xs text-muted-foreground mt-1">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={rating === 0 || !title.trim() || !content.trim() || isSubmitting}
              aria-label="Submit your review"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}