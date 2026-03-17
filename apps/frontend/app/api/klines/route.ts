import { NextRequest, NextResponse } from 'next/server';
import { demoKlines, fetchAoxKlines, parseKlineQuery } from '@/lib/server/aoxApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { interval, limit } = parseKlineQuery(searchParams.get('interval'), searchParams.get('limit'));

  try {
    const res = await fetchAoxKlines(interval, limit);

    if (!res.ok) {
      return NextResponse.json({ data: demoKlines, warning: `remote_status_${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ data: demoKlines, warning: 'remote_unreachable' }, { status: 200 });
  }
}
