import React from "react";
import { Grid3X3, ShieldCheck, ShoppingBag, Star, Tag, Truck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductMiniRow from "../components/ProductMiniRow";
import StatCard from "../components/StatCard";
import { useProducts } from "../hooks/useProducts";
import { selectTotalPrice, selectTotalQty } from "../store/cartSlice";

const greet = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const categoryIcons = {
  electronics: "💻",
  clothing: "👕",
  furniture: "🪑",
  home: "🏠",
  sports: "🏋",
  accessories: "🎒",
};

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const totalQty = useSelector(selectTotalQty);
  const totalPrice = useSelector(selectTotalPrice);
  const { data: products = [], isLoading } = useProducts();

  const categories = [...new Set(products.map((product) => product.category))];
  const topRated = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 5);
  const newArrivals = products.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-surface border border-white/10 p-6 md:p-10">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(200,244,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(200,244,0,1)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex-1">
            <p className="text-volt/80 text-sm font-medium tracking-widest uppercase">{greet()}</p>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
              Welcome back,
              <br />
              <span className="text-volt">{user?.name?.split(" ")[0] || "Shopper"}!</span>
            </h1>
            <p className="text-white/50 text-sm mt-4 max-w-md">
              Explore curated products picked just for you, with fast delivery and secure checkout.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/products" className="btn-volt px-5 py-2.5">
                Shop Now
              </Link>
              <Link to="/products" className="btn-ghost px-5 py-2.5">
                View All Products
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-48">
            <div className="rounded-2xl bg-volt/10 border border-volt/20 p-4 text-center">
              <p className="font-heading text-4xl font-bold text-volt">50</p>
              <p className="text-xs text-white/40">Products Available</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
              <p className="font-heading text-2xl font-bold">Free</p>
              <p className="text-xs text-white/40">Delivery on ₹999+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Cart Items" value={totalQty} sub="In your bag" />
        <StatCard icon={Wallet} label="Cart Value" value={`$${totalPrice.toFixed(2)}`} color="text-blue-400" sub="Ready to checkout" />
        <StatCard icon={Star} label="Top Products" value={topRated.length} color="text-amber-400" sub="Highly rated" />
        <StatCard icon={Grid3X3} label="Categories" value={categories.length} color="text-purple-400" sub="To explore" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-sm text-volt hover:text-[#e2ff66]">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="rounded-2xl bg-white text-ink border border-white/20 p-4 text-center hover:-translate-y-0.5 transition-all capitalize"
            >
              <div className="text-3xl mb-2">{categoryIcons[category] || "📦"}</div>
              <p className="text-sm font-semibold">{category}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-surface border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold flex items-center gap-2">
              <Star size={18} className="text-amber-400 fill-amber-400" /> Top Rated
            </h2>
            <Link to="/products?sort=rating" className="text-xs text-volt font-semibold">
              See all
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-black/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 skeleton rounded-xl my-1" />)
              : topRated.map((product) => <ProductMiniRow key={product.id} product={product} />)}
          </div>
        </div>
        <div className="rounded-3xl bg-surface border border-white/10 p-5">
          <h2 className="font-heading font-bold mb-3">New Arrivals</h2>
          <div className="flex flex-col divide-y divide-black/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 skeleton rounded-xl my-1" />)
              : newArrivals.map((product) => <ProductMiniRow key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Truck, label: "Fast Delivery", desc: "Same-day on select items" },
          { icon: ShieldCheck, label: "Secure Payments", desc: "100% encrypted checkout" },
          { icon: Tag, label: "Best Prices", desc: "Price-match guarantee" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="rounded-2xl bg-surface border border-white/10 p-4 flex items-center gap-3">
            <Icon className="text-volt" size={22} />
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-white/35">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
