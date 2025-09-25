'use client';

import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function ReviewSummary({ averageRating, totalReviews, ratingBreakdown }: ReviewSummaryProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index === Math.floor(rating) && rating % 1 !== 0
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
        aria-hidden="true"
      />
    ));
  };

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2" aria-label={`Average rating: ${averageRating.toFixed(1)} out of 5 stars`}>
              {renderStars(averageRating)}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews.toLocaleString()} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
              const percentage = getPercentage(count);

              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={percentage}
                      className="h-2"
                      aria-label={`${rating} star ratings: ${percentage}% of total reviews`}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-primary">
              {getPercentage(ratingBreakdown[5] + ratingBreakdown[4])}%
            </div>
            <p className="text-xs text-muted-foreground">Positive Reviews</p>
          </div>
          <div>
            <div className="text-2xl font-semibold text-primary">
              {averageRating >= 4.5 ? '★★★★★' : averageRating >= 3.5 ? '★★★★☆' : '★★★☆☆'}
            </div>
            <p className="text-xs text-muted-foreground">Overall Rating</p>
          </div>
          <div>
            <div className="text-2xl font-semibold text-primary">
              {totalReviews > 100 ? '100+' : totalReviews}
            </div>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}