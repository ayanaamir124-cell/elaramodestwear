"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { defaultProducts } from "@/lib/data";
import { Product } from "@/lib/types";

const CATS = ["All","Co-ord Sets","Occasion Wear","Casual Wear"];

function ShopContent() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [filter, setFilter] = useState("All");
  const searchParams = useSearchParams();

  useEffect(() => { const c=searchParams.get("cat"); if(c) setFilter(c); }, [searchParams]);
  useEffect(() => { fetch("/api/products").then(r=>r.json()).then(setProducts).catch(()=>{}); }, []);

  const filtered = filter==="All" ? products : products.filter(p=>p.category===filter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ paddingTop:"var(--nav-h)" }}>
        <div style={{ padding:"60px var(--sp-section-x) 40px", borderBottom:"1px solid var(--c-border)" }}>
          <div className="mx-auto" style={{ maxWidth:"var(--max-w)" }}>
            <span className="section-label">Our Collection</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h1 className="font-display font-light" style={{ fontSize:"clamp(40px,6vw,64px)" }}>Shop All</h1>
              <div className="flex flex-wrap gap-2">
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setFilter(c)} className={`px-5 py-2 font-body text-[11px] tracking-widest uppercase border cursor-pointer transition-all ${filter===c?"bg-[var(--c-primary)] text-[var(--c-bg)] border-[var(--c-primary)]":"bg-transparent text-[var(--c-text)] border-[var(--c-border)] hover:border-[var(--c-primary)]"}`} style={{ borderRadius:"var(--radius)" }}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding:"60px var(--sp-section-x)" }}>
          <div className="mx-auto" style={{ maxWidth:"var(--max-w)" }}>
            <div className="grid grid-cols-2 lg:grid-cols-3" style={{ gap:"var(--sp-gap)" }}>
              {filtered.map(p=><ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length===0 && <p className="text-center py-24 font-display text-2xl italic" style={{ color:"var(--c-accent)" }}>No pieces in this category.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return <Suspense><ShopContent /></Suspense>;
}
