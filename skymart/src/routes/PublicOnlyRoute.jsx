import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicOnlyRoute() {
  const user = useSelector((state) => state.auth.user);
  return user ? <Navigate to="/home" replace /> : <Outlet />;
}
