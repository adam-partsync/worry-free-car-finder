import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')

    const whereClause = vehicleId
      ? { userId: user.id, vehicleId }
      : { userId: user.id }

    const records = await db.maintenanceRecord.findMany({
      where: whereClause,
      include: {
        vehicle: true
      },
      orderBy: { serviceDate: 'desc' }
    })

    return NextResponse.json({ records })

  } catch (error) {
    console.error('Error fetching maintenance records:', error)
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
      vehicleId,
      serviceType,
      description,
      serviceProvider,
      mileage,
      cost,
      laborCost,
      partsCost,
      nextServiceDue,
      nextServiceMileage,
      notes,
      serviceDate,
      warrantyUntil,
      isCompleted = true
    } = await request.json()

    // Validation
    if (!vehicleId || !serviceType || !description || !serviceDate) {
      return NextResponse.json(
        { error: 'Vehicle, service type, description, and service date are required' },
        { status: 400 }
      )
    }

    // Verify the vehicle belongs to the user
    const vehicle = await db.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: user.id
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Validate service date
    const parsedServiceDate = new Date(serviceDate)
    if (Number.isNaN(parsedServiceDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid service date' },
        { status: 400 }
      )
    }

    // Validate optional dates
    let parsedNextServiceDue = null
    if (nextServiceDue) {
      parsedNextServiceDue = new Date(nextServiceDue)
      if (Number.isNaN(parsedNextServiceDue.getTime())) {
        return NextResponse.json(
          { error: 'Invalid next service due date' },
          { status: 400 }
        )
      }
    }

    let parsedWarrantyUntil = null
    if (warrantyUntil) {
      parsedWarrantyUntil = new Date(warrantyUntil)
      if (Number.isNaN(parsedWarrantyUntil.getTime())) {
        return NextResponse.json(
          { error: 'Invalid warranty date' },
          { status: 400 }
        )
      }
    }

    const maintenanceRecord = await db.maintenanceRecord.create({
      data: {
        userId: user.id,
        vehicleId,
        serviceType: serviceType.trim(),
        description: description.trim(),
        serviceProvider: serviceProvider?.trim() || null,
        mileage: mileage || null,
        cost: cost || null,
        laborCost: laborCost || null,
        partsCost: partsCost || null,
        nextServiceDue: parsedNextServiceDue,
        nextServiceMileage: nextServiceMileage || null,
        notes: notes?.trim() || null,
        serviceDate: parsedServiceDate,
        warrantyUntil: parsedWarrantyUntil,
        isCompleted
      },
      include: {
        vehicle: true
      }
    })

    // Update vehicle mileage if provided and it's higher than current
    if (mileage && (!vehicle.mileage || mileage > vehicle.mileage)) {
      await db.vehicle.update({
        where: { id: vehicleId },
        data: { mileage }
      })
    }

    return NextResponse.json({
      message: 'Maintenance record added successfully',
      record: maintenanceRecord
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding maintenance record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
