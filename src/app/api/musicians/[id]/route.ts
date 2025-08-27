import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Musician from '@/lib/models/Musician';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { name, instrument } = body;

    if (!name || !instrument) {
      return NextResponse.json(
        { success: false, error: 'Name and instrument are required' },
        { status: 400 }
      );
    }

    const musician = await Musician.findByIdAndUpdate(
      id,
      { name: name.trim(), instrument: instrument.trim() },
      { new: true, runValidators: true }
    );

    if (!musician) {
      return NextResponse.json(
        { success: false, error: 'Musician not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: musician });
  } catch (error) {
    console.error('Error updating musician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update musician' },
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
    const musician = await Musician.findByIdAndDelete(id);

    if (!musician) {
      return NextResponse.json(
        { success: false, error: 'Musician not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Musician deleted successfully' });
  } catch (error) {
    console.error('Error deleting musician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete musician' },
      { status: 500 }
    );
  }
}


