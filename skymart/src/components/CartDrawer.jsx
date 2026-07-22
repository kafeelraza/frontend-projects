import React from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  clearCart,
  closeCart,
  decrement,
  increment,
  removeFromCart,
  selectCartItems,
  selectCartOpen,
  selectTotalPrice,
} from "../store/cartSlice";

export default function CartDrawer() {
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkout = () => {
    if (!items.length) return;
    toast.success("Order placed!");
    dispatch(clearCart());
    dispatch(closeCart());
  };

  return (
    <>
      <div
        onClick={() => dispatch(closeCart())}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={19} className="text-volt" />
            <h2 className="font-heading font-bold">Cart</h2>
            {items.length > 0 && <span className="badge bg-volt/15 text-volt">{items.length} items</span>}
          </div>
          <button onClick={() => dispatch(closeCart())} className="p-2 rounded-xl hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
              <ShoppingBag size={36} className="text-white/20" />
            </div>
            <p className="font-heading font-semibold text-white/75 text-lg">Cart is empty</p>
            <p className="text-sm text-white/35">Go shop something cool!</p>
            <button
              onClick={() => {
                dispatch(closeCart());
                navigate("/products");
              }}
              className="btn-volt mt-2 px-5 py-2.5"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-[72px] h-[72px] bg-white rounded-xl shrink-0 overflow-hidden p-2">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/85 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-white/35 mt-1">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(decrement(item.id))} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(increment(item.id))} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="ml-auto text-red-400/70 hover:text-red-400 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-heading text-volt font-semibold shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">Total</span>
                <span className="font-heading font-bold text-2xl">${total.toFixed(2)}</span>
              </div>
              <button onClick={checkout} className="w-full btn-volt py-3">
                Checkout
              </button>
              <button onClick={() => dispatch(clearCart())} className="w-full text-center text-xs text-white/30 hover:text-red-400 py-1">
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
