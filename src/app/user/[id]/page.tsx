"use client";

import { getUserById } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import QueryWrapper from "@/components/QueryWrapper";

const GetUser = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getUserById", id],
    queryFn: () => getUserById(Number(id)),
  });

  if (isLoading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );

  if (isError)
    return <div className="error-state">Error: {(error as Error).message}</div>;
  return (
    <div className="user-container">
      <h1 className="user-title">User {id}</h1>
      <div className="user-info">
        <div className="user-field">
          <span className="user-label">Name</span>
          <div className="user-value">
            {data?.firstName} {data?.lastName}
          </div>
        </div>
        <div className="user-field">
          <span className="user-label">Email</span>
          <div className="user-value">{data?.email}</div>
        </div>
      </div>
    </div>
  );
};

export default function UserPage() {
  return (
    <QueryWrapper>
      <GetUser />
    </QueryWrapper>
  );
}
