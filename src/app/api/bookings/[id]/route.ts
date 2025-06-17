import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Booking from '@/lib/models/Booking';
import Event from '@/lib/models/Event';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    const booking = await Booking.findById(id).lean();
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT request received for booking update');
    await connectToDatabase();
    const { id } = await params;
    console.log('Booking ID:', id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate the status if it's being updated
    if (body.status && !['pending', 'confirmed', 'declined', 'completed'].includes(body.status)) {
      console.error('Invalid status:', body.status);
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    console.log('Updated booking:', booking);

    if (!booking) {
      console.error('Booking not found for ID:', id);
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // If booking is being confirmed, create an event
    if (body.status === 'confirmed' && !await Event.findOne({ bookingId: id })) {
      try {
        console.log('Creating event from confirmed booking:', id);
        
        // Generate event title based on event type and venue
        const eventTypeMap: { [key: string]: string } = {
          'wedding': 'Wedding Reception',
          'corporate': 'Corporate Event',
          'festival': 'Festival Performance',
          'private-party': 'Private Party',
          'bar-gig': 'Live Performance',
          'other': 'Live Performance'
        };
        
        const eventTitle = `${eventTypeMap[booking.eventType] || 'Live Performance'} at ${booking.venue}`;
        
        const newEvent = new Event({
          title: eventTitle,
          description: `2HTSounds live performance at ${booking.venue}. ${booking.message}`,
          date: booking.eventDate,
          venue: booking.venue,
          address: booking.address,
          city: booking.city,
          state: booking.state,
          isPublic: false, // Default to private, admin can make public later
          bookingId: id,
        });

        await newEvent.save();
        console.log('Event created successfully:', newEvent._id);
      } catch (eventError) {
        console.error('Error creating event from booking:', eventError);
        // Don't fail the booking update if event creation fails
      }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 