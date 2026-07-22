import React from "react";
import { Star } from "lucide-react";

export default function RatingStars({ rate = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rate} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((number) => (
        <Star
          key={number}
          size={size}
          className={
            number <= Math.round(rate)
              ? "fill-amber-400 text-amber-400"
              : "fill-white/10 text-white/15"
          }
        />
      ))}
    </div>
  );
}
