import { NextRequest, NextResponse } from 'next/server';
import { fetchAoxTicker, getDemoTicker, normalizeTicker, parseNetworkQuery } from '@/lib/server/aoxApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const network = parseNetworkQuery(searchParams.get('network'));
import { NextResponse } from 'next/server';
import { demoTicker, fetchAoxTicker } from '@/lib/server/aoxApi';

  try {
    const res = await fetchAoxTicker(network);

    if (!res.ok) {
      return NextResponse.json({ ...getDemoTicker(network), warning: `remote_status_${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(normalizeTicker(data, network), { status: 200 });
  } catch {
    return NextResponse.json({ ...getDemoTicker(network), warning: 'remote_unreachable' }, { status: 200 });
    if (!res.ok) {
      return NextResponse.json({ ...getDemoTicker(network), warning: `remote_status_${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(normalizeTicker(data, network), { status: 200 });
  } catch {
    return NextResponse.json({ ...getDemoTicker(network), warning: 'remote_unreachable' }, { status: 200 });
    const data = await res.json();
    return NextResponse.json(normalizeTicker(data, network), { status: 200 });
  } catch {
    return NextResponse.json({ ...getDemoTicker(network), warning: 'remote_unreachable' }, { status: 200 });
    const res = await fetchAoxTicker();

    if (!res.ok) {
      return NextResponse.json({ ...demoTicker, warning: `remote_status_${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ ...demoTicker, warning: 'remote_unreachable' }, { status: 200 });
  }
}
