"use client";

import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUsers, deleteUser } from "@/api/users";
import Link from "next/link";
import { useRef, useCallback, useState } from "react";

export default function UsersList() {
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationMode, setPaginationMode] = useState<
    "infinite" | "pagination"
  >("infinite");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);

  // Infinite query for infinite scroll mode
  const infiniteQuery = useInfiniteQuery<any>({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam = 0 }) => fetchUsers(10, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * 10;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
    initialPageParam: 0,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    enabled: paginationMode === "infinite",
  });

  // Regular query for pagination mode
  const paginationQuery = useQuery({
    queryKey: ["users", "pagination", currentPage],
    queryFn: () => fetchUsers(10, currentPage * 10),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    enabled: paginationMode === "pagination",
  });

  // Use the appropriate query based on mode
  const activeQuery =
    paginationMode === "infinite" ? infiniteQuery : paginationQuery;
  const { data, isLoading, isError, error, refetch } = activeQuery as any;

  // Additional properties for infinite mode
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;

  const deleteMutation = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (paginationMode === "infinite") {
        queryClient.invalidateQueries({ queryKey: ["users", "infinite"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["users", "pagination"] });
      }
      queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "active",
      });
      setDeletingUserId(null);
    },
    onError: () => {
      setDeletingUserId(null);
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setDeletingUserId(id);
      deleteMutation.mutate(id);
    }
  };

  const handleInvalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleInvalidateCurrentMode = () => {
    if (paginationMode === "infinite") {
      queryClient.invalidateQueries({ queryKey: ["users", "infinite"] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["users", "pagination"] });
    }
  };

  const handleInvalidateAndRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
      refetchType: "all",
    });
  };

  const handleRemoveQueries = () => {
    queryClient.removeQueries({ queryKey: ["users"] });
  };

  const handleResetQueries = () => {
    queryClient.resetQueries({ queryKey: ["users"] });
  };

  const handleToggleAutoRefetch = () => {
    setRefetchInterval((prev) => (prev ? false : 10000));
  };

  const handleSetRefetchInterval = (interval: number) => {
    setRefetchInterval(interval);
  };

  // Intersection Observer for infinite scrolling
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || paginationMode === "pagination") return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, paginationMode]
  );

  // Get users based on mode
  const getUsers = () => {
    if (paginationMode === "infinite") {
      return data?.pages?.flatMap((page: any) => page.users) || [];
    } else {
      return data?.users || [];
    }
  };

  const users = getUsers();
  const totalUsers =
    paginationMode === "infinite"
      ? data?.pages?.[0]?.total || 0
      : data?.total || 0;
  const totalPages = Math.ceil(totalUsers / 10);

  // Pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-gray-600 text-lg font-medium">
              Loading users...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Users
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "An error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users List</h2>
            <p className="text-gray-600">
              {paginationMode === "infinite"
                ? `${users.length} of ${totalUsers} users loaded`
                : `Page ${currentPage + 1} of ${totalPages} (${
                    users.length
                  } users)`}
            </p>
            {refetchInterval && (
              <p className="text-sm text-blue-600 mt-1">
                Auto-refreshing every {refetchInterval / 1000}s
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPaginationMode("infinite");
                setCurrentPage(0);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                paginationMode === "infinite"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Infinite Scroll
            </button>
            <button
              onClick={() => {
                setPaginationMode("pagination");
                setCurrentPage(0);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                paginationMode === "pagination"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Pagination
            </button>
          </div>

          {/* Pagination Controls */}
          {paginationMode === "pagination" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Query Management Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Query Management
        </h3>

        {/* Background Refetching Controls */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Background Refetching
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggleAutoRefetch}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                refetchInterval
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {refetchInterval ? "Stop Auto-Refresh" : "Start Auto-Refresh"}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSetRefetchInterval(5000)}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
              >
                5s
              </button>
              <button
                onClick={() => handleSetRefetchInterval(10000)}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
              >
                10s
              </button>
              <button
                onClick={() => handleSetRefetchInterval(30000)}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
              >
                30s
              </button>
            </div>
          </div>
        </div>

        {/* Query Invalidation Controls */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Query Invalidation Strategies
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleInvalidateUsers}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              Invalidate Users
            </button>
            <button
              onClick={handleInvalidateCurrentMode}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              Invalidate Current Mode
            </button>
            <button
              onClick={handleInvalidateAndRefetch}
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              Invalidate & Refetch
            </button>
            <button
              onClick={handleRemoveQueries}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              Remove from Cache
            </button>
            <button
              onClick={handleResetQueries}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              Reset Queries
            </button>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-600">
            Get started by adding your first user above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user: any, index: number) => {
            const isLastUser = index === users.length - 1;
            const shouldObserve = paginationMode === "infinite" && isLastUser;
            const isDeleting = deletingUserId === user.id;

            return (
              <div
                key={user.id}
                ref={shouldObserve ? lastUserElementRef : null}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 group"
              >
                <Link
                  href={`/user/${user.id}`}
                  className="flex-1 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(user.id, user.firstName)}
                  disabled={isDeleting}
                  className="ml-4 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 group-hover:bg-red-100"
                  title="Delete user"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {paginationMode === "infinite" && isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">
              Loading more users...
            </span>
          </div>
        </div>
      )}

      {/* End of list indicator for infinite scroll */}
      {paginationMode === "infinite" && !hasNextPage && users.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
            <svg
              className="w-4 h-4"
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
            All users loaded
          </div>
        </div>
      )}
    </div>
  );
}
