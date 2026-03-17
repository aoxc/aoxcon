import { NextResponse } from 'next/server';
import { demoTicker, fetchAoxTicker, normalizeTicker } from '@/lib/server/aoxApi';

export async function GET() {
  try {
    const res = await fetchAoxTicker();

    if (!res.ok) {
      return NextResponse.json({ ...demoTicker, warning: `remote_status_${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(normalizeTicker(data), { status: 200 });
  } catch {
    return NextResponse.json({ ...demoTicker, warning: 'remote_unreachable' }, { status: 200 });
  }
}
