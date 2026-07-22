import React from "react";
import { Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, openCart, selectInCart } from "../store/cartSlice";
import RatingStars from "./RatingStars";

export default function ProductCard({ product, style }) {
  const dispatch = useDispatch();
  const inCart = useSelector(selectInCart(product.id));

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success(inCart ? "Quantity updated!" : "Added to cart");
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card group flex flex-col animate-fadein" style={style}>
      <div className="relative bg-white aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
        />
        <span className="badge absolute top-2.5 left-2.5 bg-ink/80 text-white/80 backdrop-blur capitalize text-[10px]">
          {product.category}
        </span>
      </div>
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <span className="text-[10px] tracking-widest uppercase text-white/30">{product.category}</span>
        <h3 className="text-sm font-medium leading-snug text-white/85 line-clamp-2 min-h-10">
          {product.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <RatingStars rate={product.rating.rate} size={11} />
          <span className="text-[11px] text-white/35">({product.rating.count})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="font-heading text-volt font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className={`p-2 rounded-xl transition-colors ${
              inCart
                ? "bg-green-500/15 text-green-400 border border-green-500/20"
                : "bg-volt text-ink hover:bg-[#e2ff66]"
            }`}
            aria-label={inCart ? "Product is in cart" : "Add product to cart"}
          >
            {inCart ? <Check size={15} /> : <Plus size={15} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
