'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  verified: boolean;
  helpful: number;
  carId: string;
}

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string) => void;
}

export function ReviewCard({ review, onMarkHelpful }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
        aria-hidden="true"
      />
    ));
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.userAvatar} alt={`${review.userName}'s avatar`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {review.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{review.userName}</h4>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified Renter
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h5 className="font-medium mb-2">{review.title}</h5>
        <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkHelpful?.(review.id)}
            className="text-muted-foreground hover:text-primary"
            aria-label={`Mark this review as helpful. Currently ${review.helpful} people found this helpful.`}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Helpful ({review.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}