import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl text-red-500">🚫</div>
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>

          <Link
            href="/login"
            className="inline-block w-full bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            Login with Different Account
          </Link>
        </div>
      </div>
    </div>
  );
}
