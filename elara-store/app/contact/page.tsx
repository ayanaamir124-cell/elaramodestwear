"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); toast.success("Message sent! We'll reply within 24 hours ✓"); };
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ paddingTop:"var(--nav-h)" }}>
        <div className="mx-auto grid md:grid-cols-2 gap-16 lg:gap-24" style={{ maxWidth:"var(--max-w)", padding:"80px var(--sp-section-x)" }}>
          <div>
            <span className="section-label">Get in Touch</span>
            <h1 className="font-display font-light mb-4" style={{ fontSize:"clamp(40px,5vw,60px)" }}>Contact Us</h1>
            <div className="w-10 h-px mb-8" style={{ background:"var(--c-accent)" }} />
            <p className="font-body font-light leading-relaxed mb-12 max-w-sm" style={{ fontSize:"var(--fs-body)", color:"var(--c-muted)" }}>
              We'd love to hear from you. Whether you have a question about sizing, a custom order, or simply want to say hello — our team is always here.
            </p>
            <div className="space-y-5 mb-12">
              {[["Email","hello@elaramodestwear.com"],["WhatsApp","+92 300 1234567"],["Hours","Mon–Sat, 10am–7pm PKT"],["Location","Karachi, Pakistan"]].map(([l,v])=>(
                <div key={l} className="flex gap-8"><span className="section-label !mb-0 w-20 flex-shrink-0">{l}</span><span className="font-body text-sm" style={{ color:"var(--c-text)" }}>{v}</span></div>
              ))}
            </div>
            <div className="flex gap-3">
              {[["Instagram","M2 2h20v20H2z M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M17.5 6.5h.01","https://instagram.com"],
                ["WhatsApp","M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z","https://wa.me/923001234567"]
              ].map(([name,,href])=>(
                <a key={name} href={href as string} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3 font-body text-[11px] tracking-widest uppercase no-underline transition-all hover:text-white"
                  style={{ background:"var(--c-surface)", color:"var(--c-text)", borderRadius:"var(--radius)" }}>
                  {name==="Instagram" ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>}
                  {name}
                </a>
              ))}
            </div>
          </div>
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="font-display text-6xl mb-4" style={{ color:"var(--c-accent)" }}>✦</p>
                <h3 className="font-display font-light mb-3" style={{ fontSize:"var(--fs-h2)" }}>Message Received</h3>
                <p className="font-body text-sm mb-8" style={{ color:"var(--c-muted)" }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" onClick={()=>setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                {[["Your Name","name","text","Fatima Ahmed"],["Email Address","email","email","you@example.com"],["Subject","subject","text","Sizing / Custom order..."]].map(([l,n,t,p])=>(
                  <div key={n as string}><label className="section-label !mb-2">{l}</label><input type={t as string} required value={(form as Record<string,string>)[n as string]} onChange={e=>setForm({...form,[n as string]:e.target.value})} placeholder={p as string} /></div>
                ))}
                <div><label className="section-label !mb-2">Message</label><textarea required rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="I'd love to know more about..." /></div>
                <button type="submit" className="btn-primary px-12 py-4">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
