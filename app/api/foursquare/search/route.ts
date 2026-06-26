import { NextRequest, NextResponse } from 'next/server';

/**
 * Foursquare Places API - Search Endpoint
 * Finds places by text query and location
 * 
 * FREE: 50,000 calls/day, no credit card required
 * Documentation: https://developer.foursquare.com/docs/places-api-getting-started
 */

export async function POST(request: NextRequest) {
  try {
    const { query, near, categories, limit } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
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
    
    // URL encode the API key if it contains special characters
    apiKey = apiKey.trim();

    // Build Foursquare Places API URL (v3)
    const url = new URL('https://api.foursquare.com/v3/places/search');
    url.searchParams.append('query', query);
    
    if (near) {
      url.searchParams.append('near', near);
    }
    
    if (categories) {
      url.searchParams.append('categories', categories);
    }
    
    url.searchParams.append('limit', limit?.toString() || '5');

    // Make request to Foursquare Places API v3
    // Log the request for debugging
    console.log('Foursquare API Request:', {
      url: url.toString(),
      apiKey: apiKey.substring(0, 10) + '...' // Only log first 10 chars for security
    });
    
    const response = await fetch(url.toString(), {
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
        { error: 'Failed to search places' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Foursquare v3 API returns data in results array
    return NextResponse.json({
      results: data.results || [],
      context: data.context || {},
    });

  } catch (error) {
    console.error('Error in Foursquare search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
