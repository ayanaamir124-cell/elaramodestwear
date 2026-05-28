"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, toggleCart } = useCartStore();
  const cartCount = count();
  const pathname = usePathname();
  const seq = useRef("");

  // Secret: type "elaraadmin" anywhere on page to open admin
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      seq.current = (seq.current + e.key).slice(-10).toLowerCase();
      if (seq.current === "elaraadmin") { window.location.href = "/admin"; seq.current = ""; }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[var(--c-bg)]/97 border-b border-[var(--c-border)]" : "bg-[var(--c-bg)]/90"} backdrop-blur-md`}
        style={{ height: "var(--nav-h)" }}>
        <div className="mx-auto px-6 lg:px-10 h-full flex items-center justify-between" style={{ maxWidth: "var(--max-w)" }}>
          <div className="hidden md:flex gap-9 items-center">
            {[{href:"/",label:"Home"},{href:"/shop",label:"Shop"},{href:"/contact",label:"Contact"}].map(l => (
              <Link key={l.href} href={l.href}
                className={`font-body text-[11px] tracking-[.2em] uppercase transition-all relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[var(--c-accent)] after:transition-all ${pathname===l.href?"after:w-full text-[var(--c-text)]":"after:w-0 text-[var(--c-accent)] hover:text-[var(--c-text)]"}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/images/logo.png" alt="Elara" width={120} height={52} className="h-12 w-auto object-contain" priority />
          </Link>
          <div className="flex gap-5 items-center">
            <button onClick={toggleCart} className="relative flex items-center cursor-pointer bg-transparent border-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-text)" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[var(--c-accent)] text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px]">{cartCount}</span>}
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-text)" strokeWidth="1.5">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[var(--c-bg)] border-t border-[var(--c-border)] px-6 py-4 flex flex-col gap-4">
            {[{href:"/",label:"Home"},{href:"/shop",label:"Shop"},{href:"/contact",label:"Contact"}].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="font-body text-[11px] tracking-[.2em] uppercase text-[var(--c-accent)] py-2 border-b border-[var(--c-border)]">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
}
