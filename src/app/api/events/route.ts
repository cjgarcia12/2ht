import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Event from '@/lib/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check if this is an admin request
    const url = new URL(request.url);
    const includePrivate = url.searchParams.get('includePrivate') === 'true';
    
    // Base query for upcoming events
    const query: { date: { $gte: Date }; isPublic?: boolean } = { date: { $gte: new Date() } };
    
    // Only include public events for public API calls
    if (!includePrivate) {
      query.isPublic = true;
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const event = new Event(body);
    await event.save();

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 