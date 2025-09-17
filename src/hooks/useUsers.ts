import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  fetchUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  fetchPosts,
  fetchUserPosts,
  fetchComments,
  searchUsers,
  searchPosts,
  User,
  Post,
  Comment,
} from "@/api/users";

// Custom hook for users with pagination
export function useUsers(limit: number = 10, skip: number = 0) {
  return useQuery({
    queryKey: ["users", "pagination", limit, skip],
    queryFn: () => fetchUsers(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Custom hook for infinite users
export function useInfiniteUsers(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: ["users", "infinite", limit],
    queryFn: ({ pageParam = 0 }) => fetchUsers(limit, pageParam),
    getNextPageParam: (
      lastPage: { total: number },
      allPages: { total: number }[]
    ): number | undefined => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

// Custom hook for single user
export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  });
}

// Custom hook for posts
export function usePosts(limit: number = 10, skip: number = 0) {
  return useQuery({
    queryKey: ["posts", limit, skip],
    queryFn: () => fetchPosts(limit, skip),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

// Custom hook for user posts
export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

// Custom hook for comments
export function useComments(postId: number) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

// Custom hook for search
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["search-posts", query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// Custom hook for batch queries (useQueries example)
export function useBatchUserData(userIds: number[]) {
  return useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUserById(id),
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      retry: 3,
    })),
  });
}

// Custom hook for user mutations
export function useUserMutations() {
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
    onError: (error) => {
      console.error("Failed to add user:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<User> }) =>
      updateUser(id, user),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(["user", variables.id], data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ["user", userId] });
      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
  });

  return {
    addUser: addUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
  };
}

// Custom hook for optimistic updates
export function useOptimisticUserUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<User> }) =>
      updateUser(id, user),
    onMutate: async ({ id, user }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user", id] });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(["user", id]);

      // Optimistically update the cache
      queryClient.setQueryData(["user", id], (old: User) => ({
        ...old,
        ...user,
      }));

      // Return a context object with the snapshotted value
      return { previousUser };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        queryClient.setQueryData(["user", variables.id], context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
}
