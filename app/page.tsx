import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold mb-6">
        Preserve Memories for the Future
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Create digital time capsules with photos, videos, and messages that unlock on special dates or life events. Share with loved ones and relive precious moments.
      </p>
      
      <div className="flex gap-4 mb-12">
        <Link href="/register">
          <Button size="lg" className="px-8">
            Get Started Free
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline" className="px-8">
            Sign In
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Create Capsules</h3>
          <p className="text-gray-600">Upload photos, videos, audio, and letters into personalized time capsules.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Set Future Unlock</h3>
          <p className="text-gray-600">Choose a date or life event when your capsule will automatically unlock.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Share with Family</h3>
          <p className="text-gray-600">Invite family members to contribute and receive notifications when it's time.</p>
        </div>
      </div>
    </div>
  );
}