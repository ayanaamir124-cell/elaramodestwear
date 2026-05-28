"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="product-card block no-underline">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "var(--c-surface)" }}>
        <Image src={product.images[0]} alt={product.name} fill className="card-img object-cover" sizes="(max-width:768px) 50vw, 25vw" />
        {product.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 font-body text-[10px] tracking-widest uppercase text-white" style={{ background: product.badge==="Sale" ? "var(--c-accent)" : "var(--c-primary)", borderRadius: "var(--radius)" }}>{product.badge}</div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/40 flex items-end justify-center pb-6">
            <span className="bg-white/90 px-4 py-1 font-body text-[11px] tracking-widest uppercase" style={{ color: "var(--c-accent)" }}>Sold Out</span>
          </div>
        )}
      </div>
      <div className="pt-4">
        <span className="section-label !mb-1">{product.category}</span>
        <h3 className="font-display font-light mb-2" style={{ fontSize: "var(--fs-h3)", color: "var(--c-dark)" }}>{product.name}</h3>
        <div className="flex gap-3 items-center">
          <span className="font-body text-sm">PKR {product.price.toLocaleString()}</span>
          {product.original_price && <span className="font-body text-xs line-through" style={{ color: "#aaa" }}>PKR {product.original_price.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}
