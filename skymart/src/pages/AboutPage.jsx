import React from "react";
import { Award, Rocket, ShieldCheck, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Products", value: "20K+" },
  { label: "Happy Customers", value: "50K+" },
  { label: "Avg. Rating", value: "4.9" },
  { label: "On-time Delivery", value: "99%" },
];

const values = [
  { icon: ShieldCheck, title: "Trust", desc: "Every product is checked for quality before it reaches the shelf." },
  { icon: Zap, title: "Speed", desc: "The entire shopping flow is designed to feel quick and effortless." },
  { icon: User, title: "Creator Focus", desc: "Built as a polished project by Kafeel Raza with a clean shopping experience." },
  { icon: Award, title: "Quality", desc: "No filler products, just useful picks across everyday categories." },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-12 animate-fadein">
      <section className="flex flex-col items-center text-center gap-4 py-6">
        <span className="w-16 h-16 rounded-3xl bg-volt text-ink flex items-center justify-center animate-float">
          <Rocket size={28} className="fill-ink" />
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
          About <span className="text-volt">SkyMart</span>
        </h1>
        <p className="text-white/45 max-w-2xl text-base leading-relaxed">
          SkyMart is a next-generation e-commerce platform created by Kafeel Raza to demonstrate clean UI, responsive design, and a smooth shopping experience.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface border border-white/10 p-5 text-center">
            <p className="font-heading text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/35 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-surface border border-white/10 p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold mb-4">Project Story</h2>
        <div className="space-y-4 text-white/55 text-sm leading-relaxed">
          <p>
            SkyMart is a modern e-commerce project built by Kafeel Raza as a complete frontend shopping experience.
          </p>
          <p>
            The project includes authentication, a product catalog, search and filters, product detail pages, cart management, and responsive layouts.
          </p>
          <p>
            The goal is simple: show a fast, polished, and production-ready React app that feels clear and enjoyable to use.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold mb-5 text-center">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-surface border border-white/10 p-5 flex gap-4 hover:border-volt/30 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-volt/10 text-volt flex items-center justify-center shrink-0">
                <Icon size={19} />
              </span>
              <div>
                <h3 className="font-heading font-bold">{title}</h3>
                <p className="text-sm text-white/40 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-surface border border-white/10 p-6 text-center flex flex-col items-center gap-3">
        <span className="w-14 h-14 rounded-2xl bg-volt text-ink flex items-center justify-center font-heading font-bold text-xl">
          K
        </span>
        <h2 className="font-heading text-2xl font-bold">Kafeel Raza</h2>
        <p className="text-sm text-white/45 max-w-xl">
          Creator of SkyMart. This project showcases frontend architecture, UI design, state management, routing, and e-commerce interactions.
        </p>
      </section>

      <section className="rounded-3xl bg-volt/10 border border-volt/20 p-8 text-center flex flex-col items-center gap-3">
        <h2 className="font-heading text-2xl font-bold">Ready to shop?</h2>
        <p className="text-white/40 text-sm">Explore thousands of products at unbeatable prices.</p>
        <Link to="/products" className="btn-volt px-6 py-3 mt-1">
          Browse Products
        </Link>
      </section>
    </div>
  );
}
