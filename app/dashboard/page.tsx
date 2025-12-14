// app/dashboard/page.tsx
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Capsule } from '@/models/Capsule';
import { CapsuleCard } from '@/components/CapsuleCard';
import Link from 'next/link';
import mongoose from 'mongoose';

export default async function DashboardPage() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();
  
  // Convert string ID to ObjectId for query
  let userId;
  try {
    userId = new mongoose.Types.ObjectId(session.user.id);
  } catch (e) {
    console.error('Invalid user ID format:', session.user.id);
    userId = session.user.id; // Fallback to string
  }
  
  const capsules = await Capsule.find({
    $or: [
      { ownerId: userId },
      { collaborators: userId },
      { recipientEmails: session.user.email },
    ],
  })
  .sort({ createdAt: -1 });

  // Convert ObjectIds to strings for the frontend
  const serializedCapsules = capsules.map(capsule => ({
    ...capsule.toObject(), // Convert Mongoose document to plain object
    _id: capsule._id.toString(), // Convert ObjectId to string
    ownerId: capsule.ownerId?.toString(),
    collaborators: capsule.collaborators?.map((c: any) => c.toString()),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
  <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
    Your Time Capsules
  </h1>

  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <Link
      href="/create/capsule"
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
    >
      + New Capsule
    </Link>

    <Link
      href="/dashboard/collections"
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center"
    >
      View Collection
    </Link>
  </div>
</div>

      
      {serializedCapsules.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No capsules yet</h3>
          <p className="text-gray-600 mb-4">Create your first time capsule to preserve memories</p>
          <Link 
            href="/create/capsule" 
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Your First Capsule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedCapsules.map((capsule) => (
            <CapsuleCard 
              key={capsule._id} 
              capsule={capsule}
            />
          ))}
        </div>
      )}
    </div>
  );
}