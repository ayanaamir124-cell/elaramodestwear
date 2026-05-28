"use client";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, total, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!form.name || !form.phone) { toast.error("Please fill name & phone"); return; }
    setLoading(true);
    try {
      await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total: total(), customer_name: form.name, customer_phone: form.phone, customer_email: form.email }) });
      toast.success("Order placed! We'll contact you soon ✓");
      clearCart(); toggleCart(); setForm({ name: "", phone: "", email: "" });
    } catch { toast.error("Something went wrong. Try again."); }
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] animate-fadeIn" onClick={toggleCart}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] flex flex-col animate-slideRight shadow-2xl" style={{ background: "var(--c-bg)" }} onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b flex justify-between items-center" style={{ borderColor: "var(--c-border)" }}>
          <h2 className="font-display text-3xl font-light">Your Bag</h2>
          <button onClick={toggleCart} className="text-2xl leading-none bg-transparent border-none cursor-pointer hover:text-[var(--c-text)]" style={{ color: "var(--c-accent)" }}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="text-center pt-20">
              <p className="font-display text-5xl mb-4" style={{ color: "#c9b9ae" }}>✦</p>
              <p className="font-display text-xl italic" style={{ color: "var(--c-accent)" }}>Your bag is empty</p>
              <button onClick={toggleCart} className="btn-outline mt-6 text-xs">Continue Shopping</button>
            </div>
          ) : (
            <>
              {items.map((item, i) => (
                <div key={i} className="flex gap-4 mb-6 pb-6 border-b" style={{ borderColor: "var(--c-border)" }}>
                  <div className="w-20 h-24 overflow-hidden flex-shrink-0" style={{ background: "var(--c-surface)" }}>
                    <Image src={item.images[0]} alt={item.name} width={80} height={96} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-[17px]">{item.name}</p>
                    <p className="section-label !mb-2 mt-1">{item.selectedColor} · {item.selectedSize}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        {[-1,null,1].map((d,j) => d===null
                          ? <span key={j} className="font-body text-sm w-5 text-center">{item.qty}</span>
                          : <button key={j} onClick={() => updateQty(item.id,item.selectedSize,item.selectedColor,item.qty+d!)} className="border w-7 h-7 cursor-pointer text-[14px] bg-transparent hover:bg-[var(--c-primary)] hover:text-white transition-colors" style={{ borderColor: "var(--c-border)" }}>{d===1?"+":" −"}</button>
                        )}
                      </div>
                      <span className="font-body text-sm">PKR {(item.price*item.qty).toLocaleString()}</span>
                    </div>
                    <button onClick={() => removeItem(item.id,item.selectedSize,item.selectedColor)} className="section-label !mb-0 mt-2 cursor-pointer bg-transparent border-none hover:text-[var(--c-text)]">Remove</button>
                  </div>
                </div>
              ))}
              <div className="p-4" style={{ background: "var(--c-surface)" }}>
                <p className="section-label !mb-3">Delivery Info</p>
                <input placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mb-2" />
                <input placeholder="Phone Number *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mb-2" />
                <input placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              </div>
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="px-8 py-6 border-t" style={{ borderColor: "var(--c-border)" }}>
            <div className="flex justify-between mb-5">
              <span className="section-label !mb-0">Total</span>
              <span className="font-display text-2xl">PKR {total().toLocaleString()}</span>
            </div>
            <button className="btn-primary w-full text-center py-4" onClick={placeOrder} disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            <p className="section-label !mb-0 text-center mt-3">Free shipping over PKR 3,000</p>
          </div>
        )}
      </div>
    </div>
  );
}
