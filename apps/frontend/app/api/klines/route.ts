import { NextRequest, NextResponse } from 'next/server';
import { demoKlines, fetchAoxKlines, normalizeKlines, parseKlineQuery, parseNetworkQuery } from '@/lib/server/aoxApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const network = parseNetworkQuery(searchParams.get('network'));
  const { interval, limit } = parseKlineQuery(searchParams.get('interval'), searchParams.get('limit'));

  try {
    const res = await fetchAoxKlines(network, interval, limit);

    if (!res.ok) {
      return NextResponse.json(demoKlines, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(normalizeKlines(data), { status: 200 });
  } catch {
    return NextResponse.json(demoKlines, { status: 200 });
  }
}
