"use client";

import { useState } from "react";
import { useOptimisticUserUpdate, useUser } from "@/hooks/useUsers";

interface OptimisticUpdateDemoProps {
  userId: number;
}

export default function OptimisticUpdateDemo({
  userId,
}: OptimisticUpdateDemoProps) {
  const { data: user, isLoading } = useUser(userId);
  const optimisticUpdate = useOptimisticUserUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleEdit = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (user) {
      optimisticUpdate.mutate(
        {
          id: user.id,
          user: {
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            email: editForm.email,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
          onError: () => {
            // Error handling is done in the hook
            console.error("Failed to update user");
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-gray-600 text-lg font-medium">
              Loading user...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
          <svg
            className="w-6 h-6 text-orange-600"
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
          <h2 className="text-2xl font-bold text-gray-900">
            Optimistic Updates Demo
          </h2>
          <p className="text-gray-600">
            See instant UI updates before server confirmation
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current User Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current User Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit User (Optimistic Update)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={optimisticUpdate.isPending}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {optimisticUpdate.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={optimisticUpdate.isPending}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit User
            </button>
          </div>
        )}

        {/* Status Messages */}
        {optimisticUpdate.isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-yellow-800 font-medium">
                Optimistically updating user... (UI updated immediately)
              </span>
            </div>
          </div>
        )}

        {optimisticUpdate.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-red-800 font-medium">
                Update failed. Changes have been reverted.
              </span>
            </div>
          </div>
        )}

        {optimisticUpdate.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-800 font-medium">
                User updated successfully!
              </span>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">
            How Optimistic Updates Work:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li> UI updates immediately when you click "Save Changes"</li>
            <li> The actual API call happens in the background</li>
            <li> If the API call fails, changes are automatically reverted</li>
            <li> If successful, the optimistic update becomes permanent</li>
            <li> This provides instant feedback and better user experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
