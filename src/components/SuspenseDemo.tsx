"use client";

import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load components for Suspense demo
const LazyUserProfile = lazy(() => import("@/components/LazyUserProfile"));
const LazyPostsList = lazy(() => import("@/components/LazyPostsList"));

// Loading fallback component
function LoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-gray-600 text-lg font-medium">{message}</span>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
      >
        Try again
      </button>
    </div>
  );
}

// Main Suspense demo component
export default function SuspenseDemo() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">React Suspense Demo</h2>
          <p className="text-gray-600">Lazy loading with React Suspense and React Query</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* User Profile with Suspense */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile (Lazy Loaded)</h3>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback message="Loading user profile..." />}>
              <LazyUserProfile userId={1} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Posts List with Suspense */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts List (Lazy Loaded)</h3>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback message="Loading posts..." />}>
              <LazyPostsList />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Multiple Suspense boundaries */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Suspense Boundaries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback message="Loading user 2..." />}>
                <LazyUserProfile userId={2} />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback message="Loading user 3..." />}>
                <LazyUserProfile userId={3} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
