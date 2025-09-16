// get all users with pagination support
export async function fetchUsers(limit: number = 10, skip: number = 0) {
  const res = await fetch(
    `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
  );
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// add user
export async function addUser(newUser: { name: string; email: string }) {
  const res = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
}

// get user by id
export async function getUserById(id: number) {
  const res = await fetch(`https://dummyjson.com/users/${id}`);
  if (!res.ok) throw new Error("Failed to get user");
  return res.json();
}

// update user
export async function updateUser(
  id: number,
  updatedUser: { name: string; email: string }
) {
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// delete user
export async function deleteUser(id: number) {
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
