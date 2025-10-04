import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/actions/product";

interface ProductReviewsProps {
  productId: string;
}

export default async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to review this product!</p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const roundedRating = Math.round(averageRating * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(averageRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-medium text-gray-900">
          {roundedRating} out of 5
        </span>
        <span className="text-sm text-gray-500">
          ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{review.author}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </time>
            </div>
            
            {review.title && (
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
            )}
            
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
