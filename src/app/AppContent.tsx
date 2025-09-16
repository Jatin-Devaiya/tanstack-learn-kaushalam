"use client";

import AddUserForm from "@/components/AddUserForm";
import UsersList from "@/components/UsersList";

export default function AppContent() {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                TanStack React Query Users Demo
              </h1>
              <p className="text-lg text-gray-600">
                Manage users with React Query for data fetching and state
                management
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add User Form */}
          <AddUserForm />

          {/* Users List */}
          <UsersList />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Built with Next.js, TanStack Query, and JSONPlaceholder API</p>
          </div>
        </div>
      </footer>
    </>
  );
}
