import React from "react";
export default function SkeletonProductCard() {
  return (
    <div className="rounded-2xl bg-surface border border-white/10 overflow-hidden">
      <div className="skeleton aspect-square bg-white/5" />
      <div className="p-3 flex flex-col gap-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
