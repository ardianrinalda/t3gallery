import { NextRequest, NextResponse } from 'next/server';
import { getMyImages, getMyImagesPage } from '~/server/queries';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit  = Number(searchParams.get('limit') ?? '20');
    const cursor = searchParams.get('cursor')
                  ? Number(searchParams.get('cursor')!)
                  : undefined;
  
    return NextResponse.json(await getMyImages());
  }