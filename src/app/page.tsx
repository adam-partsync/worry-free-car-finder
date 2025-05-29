import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Simple Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-center flex-1">
            <Logo size="xl" showText={true} />
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Find your perfect car with confidence
        </p>

        <div className="space-y-3">
          <a
            href="/wizard"
            className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg transform hover:scale-[1.02] no-underline"
          >
            🪄 Start Car Buying Wizard
          </a>
          <a
            href="/search"
            className="block w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors no-underline"
          >
            🔍 Search Cars
          </a>
          <a
            href="/why-choose"
            className="block w-full bg-indigo-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors no-underline"
          >
            ⭐ How We Make Car Buying Easier
          </a>
          <a
            href="/tools"
            className="block w-full bg-teal-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-teal-700 transition-colors no-underline"
          >
            🛠️ All Tools
          </a>
          <a
            href="/help-me-choose"
            className="block w-full bg-amber-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-amber-700 transition-colors no-underline"
          >
            🤔 Help Me Choose
          </a>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">🔐 Authentication System Ready!</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium text-green-600">✅ Login system is now live!</p>
            <p><strong>Sign Up:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/auth/signup</code></p>
            <p><strong>Sign In:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/auth/signin</code></p>
            <p><strong>Dashboard:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/dashboard</code></p>
            <p><strong>Demo Account:</strong> demo@worryfreecars.com / DemoUser123</p>

            <div className="mt-4 pt-4 border-t">
              <p className="font-medium text-gray-800">Features Available:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ User Registration</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ Email/Password Login</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ Google OAuth</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ User Dashboard</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ Password Reset</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✅ Session Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
