import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { code } = params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!code) {
    return NextResponse.json({ error: 'Scheme code is required' }, { status: 400 });
  }

  if (!period && (!from || !to)) {
    return NextResponse.json({ error: 'Provide period or from/to dates' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.mfapi.in/mf/${code}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    const { data: navHistory } = await response.json();
    // Sort NAV history descending (latest first)
    navHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let startDate;
    let endDate = new Date(navHistory[0].date); // Latest date

    if (period) {
      const now = new Date();
      endDate = now; // But we'll find closest NAV
      switch (period) {
        case '1m':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case '3m':
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case '6m':
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case '1y':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
      }
    } else {
      startDate = new Date(from);
      endDate = new Date(to);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });
      }
    }

    // Find closest NAV dates (assuming NAV is daily, find nearest past date if exact missing)
    const findClosestNav = (targetDate, history, isStart = false) => {
      for (const entry of history) {
        const entryDate = new Date(entry.date);
        if (entryDate <= targetDate) {
          return { date: entry.date, nav: parseFloat(entry.nav) };
        }
      }
      // If no past date for start, use earliest
      return isStart
        ? { date: history[history.length - 1].date, nav: parseFloat(history[history.length - 1].nav) }
        : null;
    };

    const endNavEntry = findClosestNav(endDate, navHistory);
    const startNavEntry = findClosestNav(startDate, navHistory, true);

    if (!endNavEntry || !startNavEntry) {
      return NextResponse.json({ error: 'Insufficient NAV data' }, { status: 404 });
    }

    const startNAV = startNavEntry.nav;
    const endNAV = endNavEntry.nav;
    const days = (new Date(endNavEntry.date).getTime() - new Date(startNavEntry.date).getTime()) / (1000 * 60 * 60 * 24);

    const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;

    let annualizedReturn = null;
    if (days >= 30) {
      annualizedReturn = (Math.pow(endNAV / startNAV, 365 / days) - 1) * 100;
    }

    return NextResponse.json({
      startDate: startNavEntry.date,
      endDate: endNavEntry.date,
      startNAV,
      endNAV,
      simpleReturn: simpleReturn.toFixed(2),
      annualizedReturn: annualizedReturn ? annualizedReturn.toFixed(2) : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}