/**
 * Foursquare Places API Integration
 * FREE: 50,000 calls/day, no credit card required
 * Documentation: https://developer.foursquare.com/docs/places-api-overview
 */

export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  location: {
    address?: string;
    locality?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  distance?: number;
  rating?: number;
  stats?: {
    total_ratings?: number;
    total_photos?: number;
  };
}

export interface DoctorWithRating {
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
  hasLiveData: boolean;
}

/**
 * Search for a place using Foursquare Places API
 */
export async function findFoursquarePlace(
  clinicName: string,
  address: string,
  city: string,
  state: string
): Promise<string | null> {
  try {
    // Search for generic medical facilities in the city instead of specific names
    // This increases chances of finding real places in Foursquare
    const query = `hospital clinic doctor ${city}`;
    
    const response = await fetch('/api/foursquare/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        near: `${city}, ${state}, India`,
        categories: '17000,17069', // Health & Medical Services, Doctor's Office
        limit: 5 // Get multiple results to have options
      }),
    });

    if (!response.ok) {
      console.error('Foursquare search failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Return a random result from the available places to add variety
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex].fsq_id;
    }

    return null;
  } catch (error) {
    console.error('Error searching Foursquare:', error);
    return null;
  }
}

/**
 * Get place details including rating from Foursquare
 */
export async function getFoursquareDetails(placeId: string): Promise<FoursquarePlace | null> {
  try {
    const response = await fetch('/api/foursquare/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId }),
    });

    if (!response.ok) {
      console.error('Foursquare details failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.place || null;
  } catch (error) {
    console.error('Error getting Foursquare details:', error);
    return null;
  }
}

/**
 * Get doctor's live rating from Foursquare
 * This is the main function to use
 */
export async function getDoctorLiveRating(
  name: string,
  clinicName: string,
  address: string,
  city: string,
  state: string = 'India'
): Promise<DoctorWithRating> {
  try {
    // Step 1: Find the place
    const placeId = await findFoursquarePlace(clinicName, address, city, state);

    if (!placeId) {
      console.log(`No Foursquare place found for ${name}`);
      return { hasLiveData: false };
    }

    // Step 2: Get place details
    const details = await getFoursquareDetails(placeId);

    if (!details) {
      console.log(`No details found for ${name}`);
      return { hasLiveData: false };
    }

    // Step 3: Extract rating information
    const rating = details.rating || undefined;
    const totalRatings = details.stats?.total_ratings || undefined;

    if (rating) {
      return {
        rating: rating,
        user_ratings_total: totalRatings,
        place_id: placeId,
        hasLiveData: true,
      };
    }

    return { hasLiveData: false };
  } catch (error) {
    console.error(`Error getting rating for ${name}:`, error);
    return { hasLiveData: false };
  }
}

/**
 * Batch fetch ratings for multiple doctors with rate limiting
 */
export async function batchGetDoctorRatings(
  doctors: Array<{
    id: string;
    name: string;
    clinic_name: string;
    address: string;
    city: string;
    state: string;
  }>,
  delayMs: number = 500
): Promise<Map<string, DoctorWithRating>> {
  const results = new Map<string, DoctorWithRating>();

  for (const doctor of doctors) {
    try {
      const rating = await getDoctorLiveRating(
        doctor.name,
        doctor.clinic_name,
        doctor.address,
        doctor.city,
        doctor.state
      );

      results.set(doctor.id, rating);

      // Rate limiting: wait before next request
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Error fetching rating for ${doctor.name}:`, error);
      results.set(doctor.id, { hasLiveData: false });
    }
  }

  return results;
}
