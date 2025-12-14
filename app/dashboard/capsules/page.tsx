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
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Capsule not found</h2>
        <p className="text-amber-700 mb-6">This capsule may have been deleted or doesn't exist.</p>
         <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold mb-6 group transition-colors"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      </div>
    );
  }

  const unlockDate = new Date(capsule.unlockDate);
  const isLocked = capsule.status !== 'unlocked' && unlockDate > new Date();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold mb-6 group transition-colors"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden">
        <div className="bg-amber-50 border-b-2 border-amber-200 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">{capsule.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold ${
                  isLocked 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  {isLocked ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Locked
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Unlocked
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {capsule.theme || 'Other'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-amber-700 font-medium">Unlock Date</p>
                <p className="text-lg font-bold text-amber-900">
                  {unlockDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            {isLocked && (
              <div className="mt-3 pt-3 border-t-2 border-amber-200">
                <p className="text-sm text-amber-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This capsule will automatically unlock on the date above
                </p>
              </div>
            )}
          </div>

          {capsule.description && (
            <div className="bg-white p-5 rounded-xl border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <h2 className="text-lg font-bold text-amber-900">Description</h2>
              </div>
              <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">{capsule.description}</p>
            </div>
          )}

          <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-amber-900">Status</h2>
            </div>
            <p className="text-amber-800 font-semibold capitalize">{capsule.status}</p>
          </div>

          {!isLocked && (
            <div className="pt-4">
              <Link
                href={`/unlocked/${id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-bold shadow-lg transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Open Capsule & View Contents
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}