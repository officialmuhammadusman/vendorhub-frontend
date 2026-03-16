export interface Review {
  _id:                string;
  user:               { _id: string; fullName: string; avatar: { url: string } };
  product:            { _id: string; title: string; images: { url: string }[] };
  rating:             number;
  comment:            string;
  isVerifiedPurchase: boolean;
  images:             { url: string; publicId: string }[];
  createdAt:          string;
}

export interface RatingDistribution {
  _id:   number;
  count: number;
}

export interface ReviewsResponse {
  reviews:      Review[];
  distribution: RatingDistribution[];
  pagination:   { total: number; page: number; totalPages: number };
}
