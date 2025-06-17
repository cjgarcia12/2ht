import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Song from '@/lib/models/Song';

export async function GET() {
  try {
    await connectToDatabase();
    
    const songs = await Song.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const song = new Song(body);
    await song.save();

    return NextResponse.json(
      { success: true, data: song },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create song' },
      { status: 500 }
    );
  }
} 