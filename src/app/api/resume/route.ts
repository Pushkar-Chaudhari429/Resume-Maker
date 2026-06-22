import { NextResponse } from 'next/server';
import { readResumeData, writeResumeData } from '@/lib/resumeStore';
import { ResumeData } from '@/types/resume';

export async function GET() {
  const data = await readResumeData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body: ResumeData = await request.json();

    // Save without strict validation so in-progress / draft entries are never rejected.
    // The form itself provides UX-level guidance; we don't need to block saves here.
    const saved = await writeResumeData(body);
    return NextResponse.json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save resume data.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
