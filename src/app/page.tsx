import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-20 lg:px-8">
        <div className="mx-auto max-w-2xl py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              FileBox
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A simple personal, web-based, api-driven file/document management
              service.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard/files"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
