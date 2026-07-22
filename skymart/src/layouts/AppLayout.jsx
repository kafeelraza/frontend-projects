import React from "react";
import { Outlet } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadein">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
