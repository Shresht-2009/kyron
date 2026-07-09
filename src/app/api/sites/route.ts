import { NextResponse } from 'next/server';
import { getAllSites } from '@/lib/site-store';

export async function GET() {
  return NextResponse.json({ sites: getAllSites() });
}
