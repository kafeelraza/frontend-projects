import React from "react";
export default function StatCard({ icon: Icon, label, value, sub, color = "text-volt" }) {
  return (
    <div className="rounded-2xl bg-surface border border-white/10 p-4 sm:p-5 flex items-start gap-3">
      <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xl font-heading font-bold text-white">{value}</p>
        <p className="text-xs text-white/50">{label}</p>
        {sub && <p className="text-[11px] text-white/25 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
