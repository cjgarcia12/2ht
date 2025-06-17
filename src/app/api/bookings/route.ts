import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Booking from '@/lib/models/Booking';

export async function GET() {
  try {
    await connectToDatabase();
    console.log('Fetching all bookings...');
    
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Found ${bookings.length} bookings`);

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Convert eventDate string to Date object
    if (body.eventDate && typeof body.eventDate === 'string') {
      body.eventDate = new Date(body.eventDate);
    }
    
    const booking = new Booking(body);
    await booking.save();

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 