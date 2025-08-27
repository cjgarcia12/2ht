import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Musician from '@/lib/models/Musician';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const musicians = await Musician.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: musicians });
  } catch (error) {
    console.error('Error fetching musicians:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch musicians' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, instrument } = body;

    if (!name || !instrument) {
      return NextResponse.json(
        { success: false, error: 'Name and instrument are required' },
        { status: 400 }
      );
    }

    const musician = await Musician.findOneAndUpdate(
      { name: name.trim(), instrument: instrument.trim() },
      { name: name.trim(), instrument: instrument.trim() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, data: musician }, { status: 201 });
  } catch (error) {
    console.error('Error creating musician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create musician' },
      { status: 500 }
    );
  }
}


