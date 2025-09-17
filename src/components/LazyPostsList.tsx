"use client";

import { usePosts } from "@/hooks/useUsers";

export default function LazyPostsList() {
  const { data: postsData, isLoading, isError, error } = usePosts(5, 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error loading posts: {error?.message}</p>
      </div>
    );
  }

  if (!postsData?.posts) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {postsData.posts.map((post) => {
        // Handle reactions object properly
        const reactions = typeof post.reactions === 'object' 
          ? (post.reactions as any)?.likes + (post.reactions as any)?.dislikes || 0
          : post.reactions || 0;

        return (
          <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.body}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>User ID: {post.userId}</span>
              <span>{reactions} reactions</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
