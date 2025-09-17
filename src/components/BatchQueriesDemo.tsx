"use client";

import { useState } from "react";
import { useBatchUserData, useUserMutations } from "@/hooks/useUsers";
import { User } from "@/api/users";

export default function BatchQueriesDemo() {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newUserId, setNewUserId] = useState<number>(6);

  // Use useQueries to fetch multiple users in parallel
  const userQueries = useBatchUserData(selectedUserIds);
  const { deleteUser } = useUserMutations();

  const handleAddUser = () => {
    if (newUserId && !selectedUserIds.includes(newUserId)) {
      setSelectedUserIds([...selectedUserIds, newUserId]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
      deleteUser.mutate(userId, {
        onSuccess: () => {
          handleRemoveUser(userId);
        }
      });
    }
  };

  // Calculate loading and error states
  const isLoading = userQueries.some(query => query.isLoading);
  const hasError = userQueries.some(query => query.isError);
  const isSuccess = userQueries.every(query => query.isSuccess);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batch Queries Demo</h2>
          <p className="text-gray-600">Fetch multiple users simultaneously with useQueries</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Add User ID:</label>
            <input
              type="number"
              value={newUserId}
              onChange={(e) => setNewUserId(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
              max="100"
            />
            <button
              onClick={handleAddUser}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Add User
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Selected User IDs:</span>
          {selectedUserIds.map((userId) => (
            <div
              key={userId}
              className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{userId}</span>
              <button
                onClick={() => handleRemoveUser(userId)}
                className="text-purple-600 hover:text-purple-800"
              >
                
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-2 ${isLoading ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-blue-600 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLoading ? 'Loading...' : 'Loaded'}</span>
          </div>
          <div className={`flex items-center gap-2 ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-600' : 'bg-gray-400'}`}></div>
            <span>{hasError ? 'Error' : 'No Errors'}</span>
          </div>
          <div className={`flex items-center gap-2 ${isSuccess ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-green-600' : 'bg-gray-400'}`}></div>
            <span>{isSuccess ? 'Success' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {userQueries.map((query, index) => {
          const userId = selectedUserIds[index];
          
          if (query.isLoading) {
            return (
              <div key={userId} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            );
          }

          if (query.isError) {
            return (
              <div key={userId} className="flex items-center p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-red-800">User {userId}</div>
                  <div className="text-sm text-red-600">Failed to load</div>
                </div>
                <button
                  onClick={() => query.refetch()}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            );
          }

          if (query.isSuccess && query.data) {
            const user = query.data as User;
            return (
              <div key={userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteUser(userId)}
                    disabled={deleteUser.isPending}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Delete user"
                  >
                    {deleteUser.isPending ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Batch Query Summary:</strong> Fetched {selectedUserIds.length} users in parallel. 
          {isLoading && " Some queries are still loading..."}
          {hasError && " Some queries failed."}
          {isSuccess && " All queries completed successfully!"}
        </div>
      </div>
    </div>
  );
}
