// Enhanced API functions with better error handling and more endpoints

// Types for better type safety
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender?: string;
  phone?: string;
  username?: string;
  birthDate?: string;
  image?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number | { likes: number; dislikes: number };
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  skip?: number;
  limit?: number;
}

// Enhanced error class for better error handling
export class ApiError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0,
      url
    );
  }
}

// User API functions
export async function fetchUsers(
  limit: number = 10,
  skip: number = 0
): Promise<{
  users: User[];
  total: number;
  skip: number;
  limit: number;
}> {
  return apiRequest(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
}

export async function getUserById(id: number): Promise<User> {
  return apiRequest(`https://dummyjson.com/users/${id}`);
}

export async function addUser(newUser: {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}): Promise<User> {
  return apiRequest("https://dummyjson.com/users/add", {
    method: "POST",
    body: JSON.stringify(newUser),
  });
}

export async function updateUser(
  id: number,
  updatedUser: Partial<User>
): Promise<User> {
  return apiRequest(`https://dummyjson.com/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedUser),
  });
}

export async function deleteUser(
  id: number
): Promise<{ id: number; isDeleted: boolean }> {
  return apiRequest(`https://dummyjson.com/users/${id}`, {
    method: "DELETE",
  });
}

// Posts API functions
export async function fetchPosts(
  limit: number = 10,
  skip: number = 0
): Promise<{
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}> {
  return apiRequest(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
}

export async function fetchUserPosts(userId: number): Promise<{
  posts: Post[];
  total: number;
}> {
  return apiRequest(`https://dummyjson.com/posts/user/${userId}`);
}

export async function fetchPostById(id: number): Promise<Post> {
  return apiRequest(`https://dummyjson.com/posts/${id}`);
}

// Comments API functions
export async function fetchComments(postId: number): Promise<{
  comments: Comment[];
  total: number;
}> {
  return apiRequest(`https://dummyjson.com/posts/${postId}/comments`);
}

// Batch API functions for useQueries
export async function fetchUserWithPosts(userId: number): Promise<{
  user: User;
  posts: Post[];
}> {
  const [user, postsData] = await Promise.all([
    getUserById(userId),
    fetchUserPosts(userId),
  ]);

  return {
    user,
    posts: postsData.posts,
  };
}

// Search functions
export async function searchUsers(query: string): Promise<{
  users: User[];
  total: number;
}> {
  return apiRequest(
    `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
  );
}

export async function searchPosts(query: string): Promise<{
  posts: Post[];
  total: number;
}> {
  return apiRequest(
    `https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`
  );
}
