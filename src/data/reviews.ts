// Google Places API compatible review interface
export interface GooglePlacesReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: number;
}

// Mock Google Places API data for testing - can be replaced with real API data
export const mockReviews: GooglePlacesReview[] = [
  {
    author_name: "David Davit",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s40-c",
    rating: 5,
    text: "We have used Kyle on a number of occasions. He is a very diligent & professional worker. All work has been undertaken to a very high standard. Quotes obtained upfront, and Kyle will make suggestions and have detailed discussions on options, and what to expect. Very reliable, and thorough in all aspects of what he does. We have used Kyle to upgrade internal/external lighting & electrical installations; for rental property EICR & PAT testing and remedial works; and new installations.",
    time: 1700000000,
  },
  {
    author_name: "Shivon Genus",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s40-c",
    rating: 5,
    text: "Kyle is a skilled and accommodating professional electrician. His expertise instilled a sense of confidence during the installation of our electrical devices. We would highly recommend his services for future electrical needs.",
    time: 1699000000,
  },
  {
    author_name: "Trevor Ford",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s40-c",
    rating: 5,
    text: "Kyle did a great professional job in my house, which included the installation of a new cooker ring main. He was pleasant to deal with and completed the job on time without any issues. I would definitely recommend him.",
    time: 1698000000,
  },
  {
    author_name: "Carol Benton",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s40-c",
    rating: 5,
    text: "Kyle was prompt and efficient and very easy to deal with. We needed some additional PowerPoints and he did a great job. He even hoovered up afterwards!! Would highly recommend Kyle.",
    time: 1697000000,
  },
  {
    author_name: "Poonam Dave",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s40-c",
    rating: 5,
    text: "Amazing and trustworthy engineer. Was always doing what is best for the customer. Highly recommended.",
    time: 1696000000,
  },
];

// Helper function to calculate aggregate rating from reviews
export function calculateAggregateRating(reviewsData: GooglePlacesReview[]) {
  if (!reviewsData || reviewsData.length === 0) return null;

  const totalRating = reviewsData.reduce(
    (sum, review) => sum + review.rating,
    0,
  );
  const averageRating = totalRating / reviewsData.length;

  return {
    ratingValue: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    reviewCount: reviewsData.length,
    bestRating: 5,
    worstRating: Math.min(...reviewsData.map((r) => r.rating)),
  };
}
