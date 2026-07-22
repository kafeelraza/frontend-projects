import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SkeletonProductCard from "../components/SkeletonProductCard";
import { useCategories, useProducts } from "../hooks/useProducts";

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low -> High" },
  { value: "price-desc", label: "Price: High -> Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
];

export default function ProductsPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState(params.get("sort") === "rating" ? "rating-desc" : "default");
  const { data: products = [], isLoading, isError } = useProducts();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const nextCategory = params.get("category");
    if (nextCategory) setCategory(nextCategory);
    if (params.get("sort") === "rating") setSort("rating-desc");
  }, [params]);

  const filteredProducts = useMemo(() => {
    let next = [...products];
    if (category !== "all") next = next.filter((product) => product.category === category);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      next = next.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }
    if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
    if (sort === "rating-desc") next.sort((a, b) => b.rating.rate - a.rating.rate);
    if (sort === "rating-asc") next.sort((a, b) => a.rating.rate - b.rating.rate);
    return next;
  }, [category, products, search, sort]);

  const hasFilters = search || category !== "all" || sort !== "default";
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("default");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">All Products</h1>
        <p className="text-sm text-white/40 mt-1">
          {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
          {category !== "all" && <span className="text-volt capitalize"> in {category}</span>}
        </p>
      </div>

      <section className="rounded-2xl bg-surface border border-white/10 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="field pl-10 pr-10 h-10"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                <X size={14} />
              </button>
            )}
          </div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="field h-10 sm:w-44 capitalize">
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="field h-10 sm:w-52">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="h-10 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm flex items-center gap-2 justify-center">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
            <span className="badge bg-volt/10 text-volt gap-2">
              <SlidersHorizontal size={12} /> Active filters
            </span>
            {category !== "all" && <span className="badge bg-white/5 text-white/60 capitalize">{category}</span>}
            {search && <span className="badge bg-white/5 text-white/60">"{search}"</span>}
            {sort !== "default" && <span className="badge bg-white/5 text-white/60">{sortOptions.find((option) => option.value === sort)?.label}</span>}
          </div>
        )}
      </section>

      {isError && (
        <div className="py-24 text-center">
          <p className="font-heading text-xl text-white/60">Failed to load products</p>
          <button onClick={() => window.location.reload()} className="btn-volt mt-4 px-5 py-2.5">
            Retry
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      )}

      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-heading text-xl text-white/60">No products found</p>
          <p className="text-sm text-white/30 mt-1">{search ? `No results for "${search}"` : "Try changing the filters"}</p>
          <button onClick={clearFilters} className="btn-ghost mt-4 px-5 py-2.5">
            Clear Filters
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} style={{ animationDelay: `${Math.min(index * 35, 450)}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
}
