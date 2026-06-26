import { NextRequest, NextResponse } from 'next/server';

/**
 * Foursquare Places API - Details Endpoint
 * Gets detailed information about a specific place
 * 
 * FREE: 50,000 calls/day, no credit card required
 * Documentation: https://developer.foursquare.com/docs/places-api-getting-started
 */

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    let apiKey = process.env.FOURSQUARE_API_KEY;

    if (!apiKey) {
      console.error('FOURSQUARE_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Foursquare API key is not configured' },
        { status: 500 }
      );
    }
    
    // Trim the API key to remove any whitespace
    apiKey = apiKey.trim();

    // Build Foursquare Places API URL (v3)
    const url = `https://api.foursquare.com/v3/places/${placeId}`;

    // Make request to Foursquare Places API v3
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Foursquare API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get place details' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Foursquare v3 API returns place data directly
    return NextResponse.json({
      place: data,
    });

  } catch (error) {
    console.error('Error in Foursquare details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
