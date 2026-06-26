/**
 * Google Places API Service
 * Official integration using Google's Places API (New)
 * Documentation: https://developers.google.com/maps/documentation/places/web-service
 */

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description: string;
  }>;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

export interface DoctorWithRating {
  id: string;
  name: string;
  clinic_name: string;
  address: string;
  city: string;
  state: string;
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: PlaceDetails['reviews'];
  hasLiveData: boolean;
  lastFetched?: string;
}

/**
 * Step 1: Find Place ID using Text Search
 * Searches for a doctor's clinic using name and address
 */
export async function findPlaceId(
  doctorName: string,
  clinicName: string,
  address: string,
  city: string
): Promise<string | null> {
  try {
    // Construct search query: "Clinic Name, Address, City"
    const query = `${clinicName}, ${address}, ${city}`;
    
    const response = await fetch('/api/places/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('Place search failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Return the first result's place_id
      return data.results[0].place_id;
    }

    return null;
  } catch (error) {
    console.error('Error finding place ID:', error);
    return null;
  }
}

/**
 * Step 2: Get Place Details including ratings and reviews
 * Uses the place_id to fetch comprehensive information
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch('/api/places/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId }),
    });

    if (!response.ok) {
      console.error('Place details fetch failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.result) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Complete flow: Find place and get ratings for a doctor
 * This is the main function to use in your components
 */
export async function getDoctorLiveRating(
  doctorName: string,
  clinicName: string,
  address: string,
  city: string
): Promise<{
  rating?: number;
  user_ratings_total?: number;
  reviews?: PlaceDetails['reviews'];
  place_id?: string;
  hasLiveData: boolean;
}> {
  try {
    // Step 1: Find the place ID
    const placeId = await findPlaceId(doctorName, clinicName, address, city);
    
    if (!placeId) {
      return { hasLiveData: false };
    }

    // Step 2: Get place details with ratings
    const details = await getPlaceDetails(placeId);
    
    if (!details) {
      return { hasLiveData: false, place_id: placeId };
    }

    return {
      rating: details.rating,
      user_ratings_total: details.user_ratings_total,
      reviews: details.reviews,
      place_id: placeId,
      hasLiveData: true,
    };
  } catch (error) {
    console.error('Error getting doctor live rating:', error);
    return { hasLiveData: false };
  }
}

/**
 * Batch process multiple doctors to get their ratings
 * Includes rate limiting to avoid API quota issues
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
      const liveData = await getDoctorLiveRating(
        doctor.name,
        doctor.clinic_name,
        doctor.address,
        doctor.city
      );

      results.set(doctor.id, {
        ...doctor,
        ...liveData,
        lastFetched: new Date().toISOString(),
      });

      // Rate limiting: wait between requests
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Error processing doctor ${doctor.id}:`, error);
      results.set(doctor.id, {
        ...doctor,
        hasLiveData: false,
      });
    }
  }

  return results;
}
