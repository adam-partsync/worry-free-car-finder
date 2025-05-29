import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's searches with pagination
    const searchParams = new URL(request.url).searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [searches, totalCount] = await Promise.all([
      db.search.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
        select: {
          id: true,
          query: true,
          filters: true,
          results: true,
          createdAt: true
        }
      }),
      db.search.count({
        where: {
          userId: session.user.id
        }
      })
    ]);

    // Format searches for the dashboard
    const formattedSearches = searches.map(search => {
      // Parse results to get count and basic info
      const results = search.results as any;
      const filters = search.filters as any;

      return {
        id: search.id,
        title: search.query || 'Car Search',
        description: generateSearchDescription(filters),
        resultsCount: results?.totalCount || results?.listings?.length || 0,
        dataQuality: results?.dataQuality || 'Demo',
        sources: results?.sources || [],
        createdAt: search.createdAt.toISOString(),
        query: search.query,
        filters: filters,
        hasRealData: results?.dataQuality?.includes('Real') || false
      };
    });

    return NextResponse.json({
      success: true,
      searches: formattedSearches,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching user searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch searches' },
      { status: 500 }
    );
  }
}

function generateSearchDescription(filters: any): string {
  const parts = [];

  if (filters?.query) {
    parts.push(`"${filters.query}"`);
  }

  if (filters?.interpretation) {
    parts.push(filters.interpretation);
  }

  if (filters?.postcode) {
    parts.push(`in ${filters.postcode}`);
  }

  if (filters?.aiPowered) {
    parts.push('(AI-powered)');
  }

  return parts.join(' ') || 'Car search';
}
