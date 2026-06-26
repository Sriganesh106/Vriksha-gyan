import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Places API - Place Details Endpoint
 * Gets detailed information about a place including ratings and reviews
 * 
 * API Documentation: https://developers.google.com/maps/documentation/places/web-service/details
 */

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: 'placeId parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Google Places API key is not configured' },
        { status: 500 }
      );
    }

    // Using the Place Details API
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('key', apiKey);
    
    // Request specific fields to optimize quota usage
    url.searchParams.append('fields', [
      'place_id',
      'name',
      'rating',
      'user_ratings_total',
      'reviews',
      'formatted_address',
      'formatted_phone_number',
      'website',
      'opening_hours'
    ].join(','));

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || 'Failed to fetch place details' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data.result,
      status: data.status,
    });

  } catch (error) {
    console.error('Error in place details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
