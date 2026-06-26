import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Places API - Text Search Endpoint
 * Finds a place by text query (name + address)
 * 
 * API Documentation: https://developers.google.com/maps/documentation/places/web-service/search-text
 */

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
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

    // Using the Text Search (New) API
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.append('query', query);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('type', 'doctor'); // Filter for medical establishments
    url.searchParams.append('region', 'in'); // Prioritize India

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({
        results: [],
        status: 'ZERO_RESULTS',
        message: 'No places found for this query'
      });
    }

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || 'Failed to search places' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: data.results,
      status: data.status,
    });

  } catch (error) {
    console.error('Error in place search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
