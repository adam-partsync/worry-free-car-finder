import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query }: { query: string } = await request.json();

    console.log('Debug query:', query);
    const lowerQuery = query.toLowerCase();

    // Test extraction logic
    const filters: any = {};

    // Body type extraction (same logic as main API)
    if (lowerQuery.includes('sporty') || lowerQuery.includes('sport') || lowerQuery.includes('two seat') || lowerQuery.includes('2 seat') || lowerQuery.includes('convertible') || lowerQuery.includes('coupe')) {
      filters.bodyType = ['convertible', 'coupe'];
    }

    // Features extraction
    const features = [];
    if (lowerQuery.includes('reliable') || lowerQuery.includes('reliability')) {
      features.push('reliable');
    }
    if (lowerQuery.includes('fuel economy') || lowerQuery.includes('economical') || lowerQuery.includes('low running costs') || lowerQuery.includes('cheap to run')) {
      features.push('fuel efficient');
    }
    if (lowerQuery.includes('sporty') || lowerQuery.includes('fast') || lowerQuery.includes('performance')) {
      features.push('sporty');
    }
    if (features.length > 0) {
      filters.features = features;
    }

    return NextResponse.json({
      query,
      extractedFilters: filters,
      message: 'Debug extraction successful'
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    );
  }
}
