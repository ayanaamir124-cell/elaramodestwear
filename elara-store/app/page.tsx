import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { defaultProducts, defaultSettings } from "@/lib/data";

async function getData() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const [pRes, sRes] = await Promise.all([
      fetch(`${base}/api/products`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/settings`, { next: { revalidate: 60 } }),
    ]);
    return { products: pRes.ok ? await pRes.json() : defaultProducts, settings: sRes.ok ? await sRes.json() : defaultSettings };
  } catch { return { products: defaultProducts, settings: defaultSettings }; }
}

export default async function HomePage() {
  const { products, settings: s } = await getData();

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="grid md:grid-cols-2 relative overflow-hidden" style={{ paddingTop:"var(--nav-h)", minHeight:"var(--hero-h)" }}>
          <div className="flex flex-col justify-center relative z-10" style={{ padding:"80px var(--sp-section-x) 80px var(--sp-section-x)" }}>
            <span className="section-label">New Collection 2026</span>
            <h1 className="font-display font-light leading-[1.06] tracking-tight mb-6 whitespace-pre-line" style={{ fontSize:"var(--fs-h1)", color:"var(--c-dark)" }}>
              {s.hero_headline}
            </h1>
            <div className="w-12 h-px mb-6" style={{ background:"var(--c-accent)" }} />
            <p className="font-body font-light leading-relaxed mb-12 max-w-md" style={{ fontSize:"var(--fs-body)", color:"var(--c-muted)" }}>
              {s.hero_subtitle}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop" className="btn-primary">{s.hero_btn1_text}</Link>
              <Link href="/contact" className="btn-outline">{s.hero_btn2_text}</Link>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[500px] md:min-h-0">
            <Image src={s.hero_image || "/images/hero.jpeg"} alt="Elara" fill className="object-cover object-top" priority sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-bg)] to-transparent opacity-0 md:opacity-100" />
            <div className="absolute bottom-8 right-8 backdrop-blur-sm px-6 py-4 border-l-2" style={{ background:"rgba(250,248,245,.9)", borderColor:"var(--c-accent)" }}>
              <p className="font-display text-sm italic" style={{ color:"var(--c-text)" }}>Modesty is</p>
              <p className="font-sc text-xl font-medium tracking-widest" style={{ color:"var(--c-text)" }}>Timeless Grace</p>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section style={{ padding:"var(--sp-section-y) var(--sp-section-x)" }}>
          <div className="mx-auto" style={{ maxWidth:"var(--max-w)" }}>
            <div className="text-center mb-16">
              <span className="section-label">Curated for You</span>
              <h2 className="font-display font-light" style={{ fontSize:"var(--fs-h2)" }}>Featured Pieces</h2>
              <div className="w-10 h-px mx-auto mt-5" style={{ background:"var(--c-accent)" }} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap:"var(--sp-gap)" }}>
              {products.slice(0,4).map((p: typeof defaultProducts[0]) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-16">
              <Link href="/shop" className="btn-outline">View All Pieces</Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        {s.show_stats && (
          <section style={{ background:"var(--c-primary)", padding:"76px var(--sp-section-x)" }}>
            <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-8" style={{ maxWidth:"var(--max-w)" }}>
              {[[s.stat1_num,s.stat1_label],[s.stat2_num,s.stat2_label],[s.stat3_num,s.stat3_label],[s.stat4_num,s.stat4_label]].map(([n,l],i) => (
                <div key={i} className={`text-center px-4 ${i<3?"md:border-r border-white/10":""}`}>
                  <p className="font-display font-light leading-none" style={{ fontSize:"52px", color:"#d4bfb4" }}>{n}</p>
                  <p className="section-label !mb-0 mt-3" style={{ color:"var(--c-accent)" }}>{l}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STYLE GUIDE */}
        {s.show_style_section && (
          <section style={{ padding:"var(--sp-section-y) var(--sp-section-x)", background:"var(--c-surface)" }}>
            <div className="mx-auto" style={{ maxWidth:"var(--max-w)" }}>
              <div className="text-center mb-16">
                <span className="section-label">Style Intelligence</span>
                <h2 className="font-display font-light" style={{ fontSize:"var(--fs-h2)" }}>The Art of Modest Dressing</h2>
                <div className="w-10 h-px mx-auto mt-5" style={{ background:"var(--c-accent)" }} />
              </div>
              <div className="grid md:grid-cols-3" style={{ gap:"var(--sp-gap)" }}>
                {[{icon:"✦",title:"Layer with Grace",desc:"Pair our structured blouses with flowing maxi skirts for a silhouette that moves beautifully and maintains full coverage."},
                  {icon:"◈",title:"Color Harmony",desc:"Combine neutral hijab tones — blush, cream, taupe — with rich outfit shades for a polished, intentional look."},
                  {icon:"◇",title:"Occasion Dressing",desc:"Our occasion sets transition effortlessly from daytime ceremonies to evening gatherings with minimal styling changes."}
                ].map(t => (
                  <div key={t.title} style={{ background:"var(--c-bg)", padding:"var(--sp-card)" }}>
                    <p className="font-display text-4xl mb-5" style={{ color:"#c9b9ae" }}>{t.icon}</p>
                    <h3 className="font-display font-light mb-4" style={{ fontSize:"var(--fs-h3)", color:"var(--c-dark)" }}>{t.title}</h3>
                    <p className="font-body font-light leading-relaxed" style={{ fontSize:"14px", color:"var(--c-muted)" }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {s.show_testimonials && (
          <section style={{ padding:"var(--sp-section-y) var(--sp-section-x)" }}>
            <div className="mx-auto" style={{ maxWidth:"var(--max-w)" }}>
              <div className="text-center mb-16">
                <span className="section-label">What Our Sisters Say</span>
                <h2 className="font-display font-light" style={{ fontSize:"var(--fs-h2)" }}>Loved by Thousands</h2>
                <div className="w-10 h-px mx-auto mt-5" style={{ background:"var(--c-accent)" }} />
              </div>
              <div className="grid md:grid-cols-3" style={{ gap:"var(--sp-gap)" }}>
                {[{text:"Elara pieces are the only brand I trust for both elegance and proper coverage. The quality is exceptional.",name:"Fatima A.",city:"Karachi"},
                  {text:"I wore the Layla Set to my cousin's wedding — received so many compliments. The fabric is divine.",name:"Zainab M.",city:"Lahore"},
                  {text:"Finally a brand that understands modest fashion doesn't mean boring. Elara is truly in a class of its own.",name:"Hana R.",city:"Islamabad"}
                ].map(r => (
                  <div key={r.name} style={{ background:"var(--c-surface)", padding:"var(--sp-card)" }}>
                    <p className="font-display text-5xl leading-none mb-4" style={{ color:"#c9b9ae" }}>"</p>
                    <p className="font-display italic leading-relaxed mb-6" style={{ fontSize:"18px", color:"var(--c-text)" }}>{r.text}</p>
                    <p className="section-label !mb-0">{r.name} · {r.city}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
