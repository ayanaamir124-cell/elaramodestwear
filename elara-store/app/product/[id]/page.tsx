"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/lib/store";
import { defaultProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import toast from "react-hot-toast";

const COLORS: Record<string,string> = {Maroon:"#6b2737",Navy:"#1c2e5c",Mocha:"#6b4f3a",Black:"#111",Burgundy:"#5c1a2a","Deep Rose":"#9b4a5c","Forest Green":"#2d4a35",Sage:"#7a9b8a",Blush:"#e8b4b8",Taupe:"#9b8a7d",Cream:"#ede8df","Dusty Rose":"#c9a0a8",Midnight:"#1a1a2e",Emerald:"#2d6b5a"};

export default function ProductPage({ params }: { params: Promise<{id:string}> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product|null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r=>r.json()).then((p:Product)=>{setProduct(p);setSize(p.sizes[1]||p.sizes[0]);setColor(p.colors[0]);})
      .catch(()=>{const fb=defaultProducts.find(p=>p.id===id);if(fb){setProduct(fb);setSize(fb.sizes[1]);setColor(fb.colors[0]);}});
    fetch("/api/products").then(r=>r.json()).then((all:Product[])=>setRelated(all.filter(p=>p.id!==id).slice(0,4))).catch(()=>{});
  }, [id]);

  if (!product) return <><Navbar /><div className="h-screen flex items-center justify-center"><p className="font-display text-3xl italic" style={{color:"var(--c-accent)"}}>Loading...</p></div><Footer /></>;

  const handleAdd = () => { addItem(product,size,color); toast.success(`${product.name} added ✓`); setTimeout(toggleCart,400); };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop:"var(--nav-h)" }}>
        <div style={{ padding:"14px var(--sp-section-x)" }}>
          <nav className="flex gap-2 font-body text-[11px] tracking-widest uppercase" style={{ color:"var(--c-accent)" }}>
            <Link href="/" className="hover:text-[var(--c-text)] transition-colors">Home</Link><span>/</span>
            <Link href="/shop" className="hover:text-[var(--c-text)] transition-colors">Shop</Link><span>/</span>
            <span style={{ color:"var(--c-text)" }}>{product.name}</span>
          </nav>
        </div>
        <div className="mx-auto grid md:grid-cols-2 gap-12 lg:gap-20" style={{ maxWidth:"var(--max-w)", padding:"24px var(--sp-section-x) 80px" }}>
          <div>
            <div className="relative overflow-hidden" style={{ aspectRatio:"3/4", background:"var(--c-surface)" }}>
              <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover transition-opacity duration-300" sizes="50vw" />
            </div>
            <div className="grid grid-cols-4 mt-3" style={{ gap:"8px" }}>
              {product.images.map((img,i)=>(
                <button key={i} onClick={()=>setImgIdx(i)} className={`relative overflow-hidden cursor-pointer border-2 transition-all ${imgIdx===i?"border-[var(--c-primary)]":"border-transparent opacity-60 hover:opacity-80"}`} style={{ aspectRatio:"1", background:"var(--c-surface)", padding:0 }}>
                  <Image src={img} alt="" fill className="object-cover" sizes="10vw" />
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <span className="section-label">{product.category}</span>
            <h1 className="font-display font-light mb-3" style={{ fontSize:"clamp(32px,4vw,48px)", color:"var(--c-dark)" }}>{product.name}</h1>
            <div className="flex gap-4 items-baseline mb-6">
              <span className="font-body text-xl">PKR {product.price.toLocaleString()}</span>
              {product.original_price&&<span className="font-body text-sm line-through" style={{color:"#aaa"}}>PKR {product.original_price.toLocaleString()}</span>}
            </div>
            <div className="w-full h-px mb-6" style={{ background:"var(--c-border)" }} />
            <p className="font-body font-light leading-relaxed mb-8" style={{ fontSize:"14px", color:"var(--c-muted)" }}>{product.description}</p>
            <div className="mb-7">
              <p className="section-label !mb-3">Color: <span className="normal-case tracking-normal" style={{color:"var(--c-text)"}}>{color}</span></p>
              <div className="flex gap-3">
                {product.colors.map(c=>(
                  <button key={c} title={c} onClick={()=>setColor(c)} className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${color===c?"border-[var(--c-primary)] scale-110":"border-transparent hover:scale-105"}`} style={{background:COLORS[c]||"#888"}} />
                ))}
              </div>
            </div>
            <div className="mb-8">
              <p className="section-label !mb-3">Size: <span className="normal-case tracking-normal" style={{color:"var(--c-text)"}}>{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s=>(
                  <button key={s} onClick={()=>setSize(s)} className={`px-4 py-2 font-body text-xs border cursor-pointer transition-all ${size===s?"bg-[var(--c-primary)] text-[var(--c-bg)] border-[var(--c-primary)]":"border-[var(--c-border)] hover:border-[var(--c-primary)]"}`} style={{borderRadius:"var(--radius)"}}>{s}</button>
                ))}
              </div>
            </div>
            {product.in_stock
              ? <button onClick={handleAdd} className="btn-primary w-full py-4 text-center text-sm">Add to Bag — PKR {product.price.toLocaleString()}</button>
              : <div className="py-4 text-center w-full font-body text-[11px] tracking-widest uppercase" style={{background:"var(--c-surface)",color:"var(--c-accent)"}}>Currently Out of Stock</div>
            }
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 justify-center">
              {["Free Shipping over PKR 3,000","Easy Returns 7 Days","Authentic Modest Fabric"].map(t=>(
                <span key={t} className="section-label !mb-0 text-[9px]">✦ {t}</span>
              ))}
            </div>
          </div>
        </div>
        {related.length>0&&(
          <section style={{padding:"60px var(--sp-section-x)", background:"var(--c-surface)"}}>
            <div className="mx-auto" style={{maxWidth:"var(--max-w)"}}>
              <div className="text-center mb-12">
                <span className="section-label">You May Also Like</span>
                <h2 className="font-display font-light" style={{fontSize:"var(--fs-h2)"}}>More Pieces</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4" style={{gap:"var(--sp-gap)"}}>
                {related.map(p=><ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
