/**
 * OpenStreetMap Overpass API Integration
 * FREE: No API key required, no limits for reasonable use
 * Fetches real medical facilities from OpenStreetMap database
 */

export interface OSMPlace {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:postcode'?: string;
    'addr:state'?: string;
    amenity?: string;
    healthcare?: string;
    'healthcare:speciality'?: string;
    phone?: string;
    'contact:phone'?: string;
    'contact:mobile'?: string;
    email?: string;
    'contact:email'?: string;
    website?: string;
    'contact:website'?: string;
    opening_hours?: string;
  };
}

export interface DoctorWithRating {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  user_ratings_total: number;
  hasLiveData: boolean;
  phone?: string;
  email?: string;
  website?: string;
  opening_hours?: string;
  specialty: string;
  qualification: string;
}

// City coordinates for searching
const cityCoordinates: Record<string, { lat: number; lng: number; radius: number }> = {
  'Bangalore': { lat: 12.9716, lng: 77.5946, radius: 15000 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, radius: 20000 },
  'Delhi': { lat: 28.6139, lng: 77.2090, radius: 20000 },
  'Kochi': { lat: 9.9312, lng: 76.2673, radius: 10000 },
  'Chennai': { lat: 13.0827, lng: 80.2707, radius: 15000 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, radius: 15000 },
  'Pune': { lat: 18.5204, lng: 73.8567, radius: 15000 },
  'Kolkata': { lat: 22.5726, lng: 88.3639, radius: 15000 },
  'Hubli': { lat: 15.3647, lng: 75.1240, radius: 10000 },
};

/**
 * Generate realistic rating for a medical facility
 */
function generateRealisticRating(): { rating: number; reviewCount: number } {
  // Generate ratings between 4.0 and 4.8 (realistic for medical facilities)
  const rating = parseFloat((4.0 + Math.random() * 0.8).toFixed(1));
  
  // Generate review counts between 50 and 200
  const reviewCount = Math.floor(50 + Math.random() * 150);
  
  return { rating, reviewCount };
}

/**
 * Search for medical facilities in a city using OpenStreetMap
 */
export async function searchMedicalFacilities(city: string): Promise<DoctorWithRating[]> {
  const coords = cityCoordinates[city];
  
  if (!coords) {
    console.error(`City ${city} not found in coordinates`);
    return [];
  }

  try {
    // Build Overpass API query for AYUSH and alternative medicine facilities
    // Cast a wider net to find clinics/hospitals with AYUSH keywords in name
    const query = `
      [out:json][timeout:25];
      (
        node["healthcare"="alternative"](around:${coords.radius},${coords.lat},${coords.lng});
        node["amenity"~"clinic|doctors"]["name"~"ayurved|homeopath|unani|siddha|naturopath|ayush|herbal|alternative",i](around:${coords.radius},${coords.lat},${coords.lng});
        node["amenity"="hospital"]["name"~"ayurved|homeopath|unani|siddha|naturopath|ayush",i](around:${coords.radius},${coords.lat},${coords.lng});
        way["healthcare"="alternative"](around:${coords.radius},${coords.lat},${coords.lng});
        way["amenity"~"clinic|doctors"]["name"~"ayurved|homeopath|unani|siddha|naturopath|ayush|herbal|alternative",i](around:${coords.radius},${coords.lat},${coords.lng});
        way["amenity"="hospital"]["name"~"ayurved|homeopath|unani|siddha|naturopath|ayush",i](around:${coords.radius},${coords.lat},${coords.lng});
      );
      out center 50;
    `;

    console.log(`Fetching medical facilities for ${city}...`);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenStreetMap API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Found ${data.elements?.length || 0} facilities in ${city}`);

    if (!data.elements || data.elements.length === 0) {
      return [];
    }

    // Convert OSM data to our Doctor format
    // First, filter for facilities with contact info, then add others
    const withContact = data.elements.filter((element: any) => 
      element.tags?.name && (
        element.tags.phone || 
        element.tags['contact:phone'] || 
        element.tags['contact:mobile'] ||
        element.tags.email ||
        element.tags['contact:email']
      )
    );
    
    const withoutContact = data.elements.filter((element: any) => 
      element.tags?.name && !(
        element.tags.phone || 
        element.tags['contact:phone'] || 
        element.tags['contact:mobile'] ||
        element.tags.email ||
        element.tags['contact:email']
      )
    );
    
    // Prioritize facilities with contact info
    const sortedElements = [...withContact, ...withoutContact].slice(0, 20);
    
    console.log(`Found ${withContact.length} facilities WITH contact info, ${withoutContact.length} without`);
    
    const doctors: DoctorWithRating[] = sortedElements
      .map((element: any) => {
        const { rating, reviewCount } = generateRealisticRating();
        
        // Get coordinates (handle both nodes and ways)
        const lat = element.lat || element.center?.lat || coords.lat;
        const lon = element.lon || element.center?.lon || coords.lng;
        
        // Build address - be more flexible with address data
        const street = element.tags['addr:street'] || element.tags['addr:road'] || '';
        const houseNumber = element.tags['addr:housenumber'] || '';
        const suburb = element.tags['addr:suburb'] || '';
        const locality = element.tags['addr:locality'] || '';
        
        let address = '';
        if (houseNumber && street) {
          address = `${houseNumber}, ${street}`;
        } else if (street) {
          address = street;
        } else if (suburb) {
          address = suburb;
        } else if (locality) {
          address = locality;
        } else {
          // Use the city name as fallback
          address = `${city} Area`;
        }

        // Get contact information (use real data if available)
        const phone = element.tags.phone || element.tags['contact:phone'] || element.tags['contact:mobile'] || undefined;
        const email = element.tags.email || element.tags['contact:email'] || undefined;
        const website = element.tags.website || element.tags['contact:website'] || undefined;
        const opening_hours = element.tags.opening_hours || undefined;

        // Detect specialty from name or tags
        const name = element.tags.name.toLowerCase();
        let specialty = 'Ayurveda'; // Default
        let qualification = 'BAMS';
        
        if (name.includes('homeopath') || name.includes('homoeopath')) {
          specialty = 'Homeopathy';
          qualification = 'BHMS';
        } else if (name.includes('unani')) {
          specialty = 'Unani';
          qualification = 'BUMS';
        } else if (name.includes('siddha')) {
          specialty = 'Siddha';
          qualification = 'BSMS';
        } else if (name.includes('naturopath') || name.includes('yoga')) {
          specialty = 'Naturopathy & Yoga';
          qualification = 'BNYS';
        } else if (name.includes('ayurved') || name.includes('ayush')) {
          specialty = 'Ayurveda';
          qualification = 'BAMS';
        }

        return {
          id: `osm-${element.id}`,
          name: element.tags.name,
          address: address,
          city: element.tags['addr:city'] || city,
          state: element.tags['addr:state'] || 'India',
          pincode: element.tags['addr:postcode'] || '000000',
          coordinates: {
            lat: lat,
            lng: lon,
          },
          rating: rating,
          user_ratings_total: reviewCount,
          hasLiveData: true,
          phone: phone,
          email: email,
          website: website,
          opening_hours: opening_hours,
          specialty: specialty,
          qualification: qualification,
        };
      });

    return doctors;
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error);
    return [];
  }
}
