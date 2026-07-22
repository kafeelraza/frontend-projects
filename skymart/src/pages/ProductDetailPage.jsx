import React from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck, Undo2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import RatingStars from "../components/RatingStars";
import { useProduct, useProducts } from "../hooks/useProducts";
import { addToCart, decrement, increment, openCart, selectCartItems, selectInCart } from "../store/cartSlice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: product, isLoading } = useProduct(id);
  const { data: products = [] } = useProducts();
  const inCart = useSelector(selectInCart(Number(id)));
  const cartItem = useSelector(selectCartItems).find((item) => item.id === Number(id));
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square skeleton rounded-3xl" />
        <div className="space-y-4 pt-4">
          <div className="h-5 w-24 skeleton rounded" />
          <div className="h-10 w-3/4 skeleton rounded" />
          <div className="h-8 w-1/3 skeleton rounded" />
          <div className="h-28 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-28 text-center">
        <p className="font-heading text-2xl text-white/60">Product not found</p>
        <button onClick={() => navigate("/products")} className="btn-volt mt-4 px-5 py-2.5">
          Back to Shop
        </button>
      </div>
    );
  }

  const productIndex = products.findIndex((item) => item.id === product.id);
  const previous = productIndex > 0 ? products[productIndex - 1] : null;
  const next = productIndex < products.length - 1 ? products[productIndex + 1] : null;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);

  const add = () => {
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success(inCart ? "Quantity updated!" : "Added to cart");
  };

  return (
    <div className="animate-fadein">
      <nav className="flex items-center gap-2 text-sm text-white/35 mb-7">
        <Link to="/products" className="hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Products
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-white/70 truncate max-w-52">{product.title}</span>
      </nav>

      <section className="grid lg:grid-cols-2 gap-10 xl:gap-14 mb-14">
        <div className="bg-white rounded-3xl p-8 md:p-10 flex items-center justify-center aspect-square">
          <img src={product.image} alt={product.title} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="flex flex-col gap-5">
          <span className="badge bg-volt/10 text-volt border border-volt/20 capitalize w-fit">{product.category}</span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl leading-tight">{product.title}</h1>
          <div className="flex items-center gap-3">
            <RatingStars rate={product.rating.rate} />
            <span className="font-semibold text-white/75">{product.rating.rate.toFixed(1)}</span>
            <span className="text-white/35 text-sm">({product.rating.count} reviews)</span>
          </div>
          <div className="py-4 border-y border-white/10">
            <span className="font-heading font-bold text-4xl text-volt">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.features.map((feature) => (
              <span key={feature} className="badge bg-white/5 text-white/55 border border-white/10">
                {feature}
              </span>
            ))}
          </div>

          {inCart && cartItem && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-white/50 text-sm">In cart:</span>
              <div className="flex items-center gap-3 ml-auto">
                <button onClick={() => dispatch(decrement(product.id))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-xl">
                  <Minus size={13} />
                </button>
                <span className="font-heading font-bold w-6 text-center">{cartItem.quantity}</span>
                <button onClick={() => dispatch(increment(product.id))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-xl">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={add}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-heading font-bold transition-all ${
                inCart ? "bg-green-500/15 text-green-400 border border-green-500/25" : "btn-volt"
              }`}
            >
              {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
              {inCart ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => setLiked((value) => !value)}
              className={`p-3.5 border rounded-2xl transition-all ${
                liked ? "bg-red-500/15 border-red-500/30 text-red-400" : "border-white/10 text-white/40 hover:text-red-400"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} className={liked ? "fill-red-400" : ""} />
            </button>
          </div>

          {inCart && (
            <button onClick={() => dispatch(openCart())} className="btn-ghost w-full py-3 text-sm">
              View Cart
            </button>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Delivery", sub: "On orders $50+" },
              { icon: ShieldCheck, label: "Secure Pay", sub: "256-bit SSL" },
              { icon: Undo2, label: "Easy Returns", sub: "30-day policy" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <Icon size={16} className="text-volt mx-auto mb-1.5" />
                <p className="text-white/70 text-[11px] font-semibold">{label}</p>
                <p className="text-white/30 text-[10px]">{sub}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            {previous && (
              <Link to={`/products/${previous.id}`} className="btn-ghost flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm">
                <ChevronLeft size={16} /> Previous
              </Link>
            )}
            {next && (
              <Link to={`/products/${next.id}`} className="btn-ghost flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm">
                Next <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
