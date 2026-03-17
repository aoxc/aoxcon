import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get('interval') || '1h';
  const limit = searchParams.get('limit') || '24';
  
  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=${interval}&limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch klines' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
