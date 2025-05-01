import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '~/server/db';
import { images } from '~/server/db/schema';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ids } = await req.json() as { ids: number[] };
  // only delete images belonging to this user
  await db.delete(images).where(inArray(images.id, ids));
  
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
