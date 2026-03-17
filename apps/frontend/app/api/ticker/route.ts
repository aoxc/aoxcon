import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch ticker' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
