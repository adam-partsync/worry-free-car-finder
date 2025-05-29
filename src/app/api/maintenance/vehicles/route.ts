import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const vehicles = await db.vehicle.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ vehicles })

  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const {
      make,
      model,
      year,
      registration,
      mileage,
      nickname,
      fuelType,
      transmission,
      color,
      purchaseDate,
      purchasePrice
    } = await request.json()

    // Validation
    if (!make || !model || !year) {
      return NextResponse.json(
        { error: 'Make, model, and year are required' },
        { status: 400 }
      )
    }

    if (year < 1900 || year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Invalid year' },
        { status: 400 }
      )
    }

    // Check if registration already exists for this user
    if (registration) {
      const existingVehicle = await db.vehicle.findFirst({
        where: {
          userId: user.id,
          registration: registration.toUpperCase()
        }
      })

      if (existingVehicle) {
        return NextResponse.json(
          { error: 'A vehicle with this registration is already registered' },
          { status: 400 }
        )
      }
    }

    const vehicle = await db.vehicle.create({
      data: {
        userId: user.id,
        make: make.trim(),
        model: model.trim(),
        year,
        registration: registration ? registration.toUpperCase().trim() : null,
        mileage: mileage || null,
        nickname: nickname?.trim() || null,
        fuelType: fuelType?.trim() || null,
        transmission: transmission?.trim() || null,
        color: color?.trim() || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice: purchasePrice || null
      }
    })

    return NextResponse.json({
      message: 'Vehicle added successfully',
      vehicle
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
