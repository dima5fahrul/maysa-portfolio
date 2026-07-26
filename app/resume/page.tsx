import { getResume } from '@/lib/content';
import { ResumeTimeline } from '@/components/sections/ResumeTimeline';

export default function ResumePage() {
  return <ResumeTimeline data={getResume()} />;
}
