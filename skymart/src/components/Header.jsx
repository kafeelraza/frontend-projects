import React from "react";
import { useEffect, useState } from "react";
import { LogOut, Menu, Rocket, ShoppingCart, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../store/authSlice";
import { selectTotalQty, toggleCart } from "../store/cartSlice";

const links = [
  { to: "/home", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const totalQty = useSelector(selectTotalQty);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out. See you soon!");
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/home" className="flex items-center gap-2 font-heading font-bold text-lg">
          <span className="w-8 h-8 rounded-xl bg-volt text-ink flex items-center justify-center">
            <Rocket size={17} className="fill-ink" />
          </span>
          Sky<span className="text-volt -ml-1.5">Mart</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-volt" : "text-white/60 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
            <span className="w-6 h-6 rounded-lg bg-volt text-ink text-xs font-bold flex items-center justify-center">
              {user?.avatar || user?.name?.charAt(0)}
            </span>
            <span className="text-xs text-white/70 max-w-24 truncate">{user?.name?.split(" ")[0]}</span>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-volt text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty > 9 ? "9+" : totalQty}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="hidden md:flex p-2.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 py-4 flex flex-col gap-2 bg-surface border-t border-white/10 animate-fadein">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `py-2 text-sm ${isActive ? "text-volt" : "text-white/70"}`}
            >
              {link.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="py-2 text-sm text-red-400 text-left flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
