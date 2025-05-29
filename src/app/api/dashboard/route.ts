import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Fetch user statistics
    const [searches, motChecks, vehicleChecks, dealerChecks] = await Promise.all([
      db.search.count({ where: { userId } }),
      db.mOTCheck.count({ where: { userId } }),
      db.vehicleCheck.count({ where: { userId } }),
      db.dealerCheck.count({ where: { userId } })
    ]);

    // Fetch recent activity (last 20 items)
    const [recentSearches, recentMotChecks, recentVehicleChecks, recentDealerChecks] = await Promise.all([
      db.search.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      db.mOTCheck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      db.vehicleCheck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      db.dealerCheck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Combine and sort all activity
    const allActivity = [
      ...recentSearches.map(item => ({
        id: item.id,
        type: 'search' as const,
        title: item.query || 'Car Search',
        subtitle: `Found ${(item.results as any)?.length || 0} results`,
        date: item.createdAt.toISOString(),
        data: item
      })),
      ...recentMotChecks.map(item => ({
        id: item.id,
        type: 'mot_check' as const,
        title: `MOT Check - ${item.registration}`,
        subtitle: 'Vehicle MOT history verified',
        date: item.createdAt.toISOString(),
        data: item
      })),
      ...recentVehicleChecks.map(item => ({
        id: item.id,
        type: 'vehicle_check' as const,
        title: `Vehicle Check - ${item.registration}`,
        subtitle: `${item.status} • ${item.paymentId ? 'Paid' : 'Unpaid'}`,
        status: item.status,
        date: item.createdAt.toISOString(),
        data: item
      })),
      ...recentDealerChecks.map(item => ({
        id: item.id,
        type: 'dealer_check' as const,
        title: `Dealer Check - ${item.dealerName}`,
        subtitle: item.postcode ? `Location: ${item.postcode}` : undefined,
        date: item.createdAt.toISOString(),
        data: item
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate mock saved searches (in production, this would be a real table)
    const savedSearches = [
      {
        id: '1',
        name: 'Family Car Under £15k',
        filters: {
          maxPrice: 15000,
          bodyType: ['estate', 'suv'],
          fuelType: 'petrol'
        },
        alertEnabled: true,
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        resultsCount: 24
      },
      {
        id: '2',
        name: 'Toyota Hybrid 2018+',
        filters: {
          make: 'toyota',
          fuelType: 'hybrid',
          minYear: 2018
        },
        alertEnabled: false,
        lastRun: new Date(Date.now() - 172800000).toISOString(),
        resultsCount: 8
      }
    ];

    // Fetch detailed vehicle checks for the checks tab
    const detailedVehicleChecks = await db.vehicleCheck.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const dashboardData = {
      stats: {
        totalSearches: searches,
        motChecks,
        vehicleChecks,
        dealerChecks
      },
      recentActivity: allActivity.slice(0, 20),
      savedSearches,
      vehicleChecks: detailedVehicleChecks.map(check => ({
        id: check.id,
        registration: check.registration,
        checkType: 'Basic', // This would come from payment metadata in production
        status: check.status,
        price: 299, // This would come from payment amount
        createdAt: check.createdAt.toISOString(),
        results: check.results
      }))
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
