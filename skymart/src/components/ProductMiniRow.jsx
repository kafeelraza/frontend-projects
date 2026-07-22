import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, openCart } from "../store/cartSlice";
import RatingStars from "./RatingStars";

export default function ProductMiniRow({ product }) {
  const dispatch = useDispatch();

  const add = (event) => {
    event.preventDefault();
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success("Added to cart");
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
    >
      <div className="w-12 h-12 bg-white rounded-lg shrink-0 overflow-hidden p-1">
        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate text-white/80">{product.title}</p>
        <RatingStars rate={product.rating.rate} size={11} />
      </div>
      <span className="text-sm font-heading text-volt font-semibold shrink-0">
        ${product.price.toFixed(2)}
      </span>
      <button
        onClick={add}
        className="p-1.5 rounded-lg bg-volt/10 text-volt hover:bg-volt hover:text-ink transition-colors shrink-0"
        aria-label="Add to cart"
      >
        <Plus size={14} />
      </button>
    </Link>
  );
}
