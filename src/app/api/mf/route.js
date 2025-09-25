import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.mfapi.in/mf', {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
    }

    const schemes = await response.json();
    return NextResponse.json(schemes);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}