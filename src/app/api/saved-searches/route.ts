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

    // For now, return mock saved searches since we don't have the table yet
    // In production, you'd query: db.savedSearch.findMany({ where: { userId: session.user.id } })

    const mockSavedSearches = [
      {
        id: '1',
        name: 'Family Car Under £15k',
        filters: {
          maxPrice: 15000,
          bodyTypes: ['estate', 'suv'],
          fuelTypes: ['petrol'],
          yearMin: 2015
        },
        alertsEnabled: true,
        createdAt: new Date().toISOString(),
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        resultsCount: 24
      },
      {
        id: '2',
        name: 'Toyota Hybrid 2018+',
        filters: {
          make: 'toyota',
          fuelTypes: ['hybrid'],
          yearMin: 2018
        },
        alertsEnabled: false,
        createdAt: new Date().toISOString(),
        lastRun: new Date(Date.now() - 172800000).toISOString(),
        resultsCount: 8
      }
    ];

    return NextResponse.json({
      success: true,
      searches: mockSavedSearches
    });

  } catch (error) {
    console.error('Saved searches GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, filters, alertsEnabled } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Search name is required' },
        { status: 400 }
      );
    }

    // Store in searches table for now, or create a dedicated savedSearches table
    const savedSearch = await db.search.create({
      data: {
        userId: session.user.id,
        query: name,
        filters: filters as any,
        results: null
      }
    });

    return NextResponse.json({
      success: true,
      search: {
        id: savedSearch.id,
        name,
        filters,
        alertsEnabled,
        createdAt: savedSearch.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Saved searches POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get('id');

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      );
    }

    // Delete the saved search
    await db.search.deleteMany({
      where: {
        id: searchId,
        userId: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Search deleted successfully'
    });

  } catch (error) {
    console.error('Saved searches DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete search' },
      { status: 500 }
    );
  }
}
