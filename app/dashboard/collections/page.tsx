import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Capsule } from '@/models/Capsule';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CapsuleDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  const { id } = await params;
  await dbConnect();

  const capsule = await Capsule.findById(id).lean();

  if (!capsule) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-red-600">Capsule not found</h2>
        <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{capsule.title}</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Theme</p>
          <p className="font-semibold">{capsule.theme || 'Other'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-semibold capitalize">{capsule.status}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Unlock Date</p>
          <p className="font-semibold">
            {new Date(capsule.unlockDate).toLocaleDateString()}
          </p>
        </div>
        
        {capsule.description && (
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="text-gray-800">{capsule.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}