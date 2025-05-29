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

    // Get user statistics
    const [
      totalSearches,
      recentSearches,
      motChecks,
      vehicleChecks,
      totalListingsViewed
    ] = await Promise.all([
      // Total searches count
      db.search.count({
        where: { userId: session.user.id }
      }),

      // Recent searches (last 7 days)
      db.search.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // MOT checks count
      db.mOTCheck.count({
        where: { userId: session.user.id }
      }),

      // Vehicle checks count
      db.vehicleCheck.count({
        where: { userId: session.user.id }
      }),

      // Calculate total listings viewed across all searches
      db.search.findMany({
        where: { userId: session.user.id },
        select: { results: true }
      }).then(searches => {
        return searches.reduce((total, search) => {
          const results = search.results as any;
          return total + (results?.totalCount || results?.listings?.length || 0);
        }, 0);
      })
    ]);

    // Get recent activity (last 10 searches)
    const recentActivity = await db.search.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        query: true,
        filters: true,
        results: true,
        createdAt: true
      }
    });

    // Format recent activity
    const formattedActivity = recentActivity.map(search => {
      const results = search.results as any;
      const filters = search.filters as any;

      return {
        id: search.id,
        type: 'search',
        description: `Searched for "${search.query || 'cars'}"`,
        details: {
          query: search.query,
          resultsCount: results?.totalCount || results?.listings?.length || 0,
          dataQuality: results?.dataQuality || 'Demo',
          aiPowered: filters?.aiPowered || false
        },
        timestamp: search.createdAt.toISOString(),
        relativeTime: getRelativeTime(search.createdAt)
      };
    });

    // Calculate average budget from searches
    const searchesWithBudgets = await db.search.findMany({
      where: { userId: session.user.id },
      select: { filters: true }
    });

    let averageBudget = 0;
    let budgetCount = 0;

    searchesWithBudgets.forEach(search => {
      const filters = search.filters as any;
      if (filters?.budget?.max) {
        averageBudget += filters.budget.max;
        budgetCount++;
      }
    });

    averageBudget = budgetCount > 0 ? Math.round(averageBudget / budgetCount) : 25000;

    return NextResponse.json({
      success: true,
      stats: {
        totalSearches,
        recentSearches,
        motChecks,
        vehicleChecks,
        totalListingsViewed,
        averageBudget,
        memberSince: session.user.createdAt || new Date().toISOString()
      },
      recentActivity: formattedActivity
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}
