"use client";

import { useUser, useUserPosts } from "@/hooks/useUsers";

interface LazyUserProfileProps {
  userId: number;
}

export default function LazyUserProfile({ userId }: LazyUserProfileProps) {
  const { data: user, isLoading, isError, error } = useUser(userId);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId);

  if (isLoading) {
    return (
      <div className="flex items-center p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error loading user: {error?.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
          {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
      </div>

      {user.address && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">Address</h5>
          <p className="text-sm text-gray-600">
            {user.address.address}, {user.address.city}, {user.address.state} {user.address.postalCode}
          </p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-semibold text-gray-900 mb-2">Posts</h5>
        {postsLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {postsData?.posts?.length || 0} posts
          </p>
        )}
      </div>
    </div>
  );
}
