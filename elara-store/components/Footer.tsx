import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--c-dark)", color: "#c9b9ae", padding: "76px var(--sp-section-x) 36px" }}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16" style={{ maxWidth: "var(--max-w)" }}>
        <div className="md:col-span-2">
          <Image src="/images/logo.png" alt="Elara" width={110} height={48} className="h-12 w-auto mb-6 opacity-90" />
          <p className="font-body text-sm leading-relaxed font-light max-w-xs mb-6" style={{ color: "var(--c-accent)" }}>
            Elara Modest Wear — crafting timeless fashion for the modern woman who believes elegance and modesty are inseparable.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-body text-[11px] tracking-widest uppercase no-underline transition-colors hover:text-white" style={{ color: "var(--c-accent)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              Instagram
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-body text-[11px] tracking-widest uppercase no-underline transition-colors hover:text-white" style={{ color: "var(--c-accent)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
        {[
          { title: "Shop", links: [["/shop","All Products"],["/shop?cat=Co-ord+Sets","Co-ord Sets"],["/shop?cat=Occasion+Wear","Occasion Wear"],["/shop?cat=Casual+Wear","Casual Wear"]] },
          { title: "Info", links: [["/contact","Contact Us"],["/contact","Size Guide"],["/contact","Shipping & Returns"],["/contact","Care Instructions"]] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="font-body text-[10px] tracking-[.25em] uppercase mb-5" style={{ color: "var(--c-accent)" }}>{title}</p>
            {links.map(([href, label]) => (
              <Link key={label} href={href} className="block font-body text-sm font-light mb-3 no-underline transition-colors hover:text-white" style={{ color: "#c9b9ae" }}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-3" style={{ maxWidth: "var(--max-w)" }}>
        <span className="font-body text-[11px] tracking-wide" style={{ color: "#6b5c54" }}>© 2026 Elara Modest Wear. All rights reserved.</span>
        <span className="font-display text-sm italic" style={{ color: "#6b5c54" }}>Dressed in Grace</span>
      </div>
    </footer>
  );
}
