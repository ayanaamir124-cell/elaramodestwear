
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Product, SiteSettings, DesignTokens } from "@/lib/types";
import { defaultProducts, defaultSettings, defaultDesign } from "@/lib/data";
import toast from "react-hot-toast";

type Tab = "dashboard"|"design_typography"|"design_colors"|"design_spacing"|"design_layout"|"page_hero"|"page_sections"|"page_footer"|"products"|"add_product"|"orders"|"settings"|"media";

interface Order { id:string; customer_name:string; customer_phone:string; customer_email:string; total:number; status:string; created_at:string; items:{name:string;qty:number;price:number}[] }

const SIDEBAR = [
  { section: "OVERVIEW",    items: [{ id:"dashboard",     icon:"⬡", label:"Dashboard" }] },
  { section: "DESIGN",      items: [
      { id:"design_typography", icon:"T", label:"Typography" },
      { id:"design_colors",     icon:"◉", label:"Colors" },
      { id:"design_spacing",    icon:"⊞", label:"Spacing & Layout" },
  ]},
  { section: "PAGES",       items: [
      { id:"page_hero",     icon:"▣", label:"Hero Section" },
      { id:"page_sections", icon:"≡", label:"Page Sections" },
      { id:"page_footer",   icon:"▤", label:"Footer" },
  ]},
  { section: "STORE",       items: [
      { id:"products",      icon:"◇", label:"Products" },
      { id:"orders",        icon:"✦", label:"Orders" },
  ]},
  { section: "SYSTEM",      items: [
      { id:"settings",      icon:"⚙", label:"Settings" },
      { id:"media",         icon:"⊡", label:"Media Library" },
  ]},
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [design, setDesign] = useState<DesignTokens>(defaultDesign);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editProd, setEditProd] = useState<Partial<Product>|null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const livePreviewRef = useRef<NodeJS.Timeout|null>(null);

  const load = useCallback(async () => {
    try {
      const [pR,sR,dR,oR] = await Promise.all([fetch("/api/products"),fetch("/api/settings"),fetch("/api/design"),fetch("/api/orders")]);
      if(pR.ok) setProducts(await pR.json());
      if(sR.ok) setSettings(await sR.json());
      if(dR.ok) setDesign(await dR.json());
      if(oR.ok) setOrders(await oR.json());
    } catch {}
  }, []);

  useEffect(() => { if(loggedIn) load(); }, [loggedIn, load]);

  // Apply design tokens live as CSS vars
  useEffect(() => {
    if (!loggedIn) return;
    if (livePreviewRef.current) clearTimeout(livePreviewRef.current);
    livePreviewRef.current = setTimeout(() => {
      const root = document.documentElement;
      root.style.setProperty("--fs-h1", `${design.font_size_h1}px`);
      root.style.setProperty("--fs-h2", `${design.font_size_h2}px`);
      root.style.setProperty("--fs-h3", `${design.font_size_h3}px`);
      root.style.setProperty("--fs-body", `${design.font_size_body}px`);
      root.style.setProperty("--fs-small", `${design.font_size_small}px`);
      root.style.setProperty("--fw-display", `${design.font_weight_display}`);
      root.style.setProperty("--ls-heading", `${design.letter_spacing_heading/100}em`);
      root.style.setProperty("--ls-label", `${design.letter_spacing_label/100}em`);
      root.style.setProperty("--lh-body", `${design.line_height_body/100}`);
      root.style.setProperty("--c-primary", design.color_primary);
      root.style.setProperty("--c-accent", design.color_accent);
      root.style.setProperty("--c-bg", design.color_background);
      root.style.setProperty("--c-surface", design.color_surface);
      root.style.setProperty("--c-dark", design.color_dark);
      root.style.setProperty("--c-text", design.color_text);
      root.style.setProperty("--c-muted", design.color_muted);
      root.style.setProperty("--c-border", design.color_border);
      root.style.setProperty("--sp-section-y", `${design.section_padding_y}px`);
      root.style.setProperty("--sp-section-x", `${design.section_padding_x}px`);
      root.style.setProperty("--sp-card", `${design.card_padding}px`);
      root.style.setProperty("--sp-gap", `${design.grid_gap}px`);
      root.style.setProperty("--nav-h", `${design.navbar_height}px`);
      root.style.setProperty("--max-w", `${design.max_width}px`);
      root.style.setProperty("--hero-h", `${design.hero_min_height}vh`);
      root.style.setProperty("--radius", `${design.border_radius}px`);
      root.style.setProperty("--btn-px", `${design.button_padding_x}px`);
      root.style.setProperty("--btn-py", `${design.button_padding_y}px`);
    }, 150);
  }, [design, loggedIn]);

  const saveDesign = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/design", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(design) });
      if(res.ok) toast.success("Design saved & published ✓"); else toast.error("Save failed");
    } catch { toast.error("Error"); }
    setSaving(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings) });
      if(res.ok) toast.success("Settings saved ✓"); else toast.error("Save failed");
    } catch { toast.error("Error"); }
    setSaving(false);
  };

  const saveProduct = async (p: Partial<Product>) => {
    setSaving(true);
    try {
      const isEdit = !!p.id;
      const res = await fetch(isEdit?`/api/products/${p.id}`:"/api/products", { method:isEdit?"PUT":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(p) });
      if(res.ok) { toast.success(isEdit?"Product updated ✓":"Product added ✓"); load(); setEditProd(null); setTab("products"); }
    } catch {}
    setSaving(false);
  };

  const deleteProduct = async (id: string) => {
    if(!confirm("Delete this product permanently?")) return;
    await fetch(`/api/products/${id}`,{method:"DELETE"});
    toast.success("Deleted"); setProducts(p=>p.filter(x=>x.id!==id));
  };

  const uploadImage = async (file: File, cb: (url:string)=>void) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file);
    try {
      const res = await fetch("/api/admin/upload",{method:"POST",body:fd});
      if(res.ok) { const {url} = await res.json(); cb(url); toast.success("Image uploaded ✓"); }
      else toast.error("Upload failed — add Supabase storage to enable uploads");
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const logout = async () => { await fetch("/api/admin/logout",{method:"POST"}); setLoggedIn(false); setPass(""); };

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0ebe4",fontFamily:"'Jost',sans-serif"}}>
      <div style={{background:"white",padding:"52px 44px",width:380,textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,.08)"}}>
        <Image src="/images/logo.png" alt="Elara" width={100} height={44} style={{height:44,width:"auto",margin:"0 auto 32px"}} />
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,marginBottom:6}}>Admin Panel</h2>
        <p style={{fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:32}}>Elara Modest Wear</p>
        <input type="password" placeholder="Enter your password" value={pass} onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(async()=>{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pass})});if(r.ok)setLoggedIn(true);else toast.error("Wrong password");})()}
          style={{width:"100%",border:"1px solid #ece5de",padding:"12px 16px",fontFamily:"'Jost',sans-serif",fontSize:14,marginBottom:16,outline:"none"}} />
        <button onClick={async()=>{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pass})});if(r.ok)setLoggedIn(true);else toast.error("Wrong password");}}
          style={{width:"100%",background:"#2c2420",color:"white",border:"none",padding:"14px",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>
          Sign In
        </button>
        <p style={{fontSize:11,color:"#9b7e6e",marginTop:16}}>Default: elara2026 · Change in Vercel env vars</p>
        <p style={{fontSize:10,color:"#c9b9ae",marginTop:8}}>🔒 This page is hidden from all users</p>
      </div>
    </div>
  );

  const inStock = products.filter(p=>p.in_stock).length;
  const pending = orders.filter(o=>o.status==="pending").length;

  // Helpers
  const D = (label:string, val:number, min:number, max:number, unit:string, key:keyof DesignTokens) => (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <label style={{fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e"}}>{label}</label>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"#2c2420"}}>{val}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={val} onChange={e=>setDesign(d=>({...d,[key]:Number(e.target.value)}))}
        style={{width:"100%",accentColor:"#9b7e6e",height:2}} />
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#c9b9ae",marginTop:4}}><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  );

  const C = (label:string, val:string, key:keyof DesignTokens) => (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <input type="color" value={val} onChange={e=>setDesign(d=>({...d,[key]:e.target.value}))}
        style={{width:44,height:44,border:"1px solid #ece5de",borderRadius:4,cursor:"pointer",padding:2}} />
      <div style={{flex:1}}>
        <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:4}}>{label}</label>
        <input value={val} onChange={e=>setDesign(d=>({...d,[key]:e.target.value}))}
          style={{width:"100%",border:"1px solid #ece5de",padding:"6px 10px",fontFamily:"monospace",fontSize:13}} />
      </div>
    </div>
  );

  const S = (label:string, val:string|boolean|number, key:keyof SiteSettings, type="text", rows=1) => (
    <div style={{marginBottom:20}}>
      <label style={{display:"block",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:8}}>{label}</label>
      {type==="checkbox"
        ? <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <input type="checkbox" checked={val as boolean} onChange={e=>setSettings(s=>({...s,[key]:e.target.checked}))} style={{width:18,height:18,accentColor:"#9b7e6e"}} />
            <span style={{fontFamily:"'Jost',sans-serif",fontSize:13,color:"#2c2420"}}>{val?"Visible":"Hidden"}</span>
          </label>
        : rows>1
          ? <textarea rows={rows} value={String(val)} onChange={e=>setSettings(s=>({...s,[key]:type==="number"?Number(e.target.value):e.target.value}))}
              style={{width:"100%",border:"1px solid #ece5de",padding:"10px 14px",fontFamily:"'Jost',sans-serif",fontSize:13,resize:"vertical"}} />
          : <input type={type} value={String(val)} onChange={e=>setSettings(s=>({...s,[key]:type==="number"?Number(e.target.value):e.target.value}))}
              style={{width:"100%",border:"1px solid #ece5de",padding:"10px 14px",fontFamily:"'Jost',sans-serif",fontSize:13}} />
      }
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Jost',sans-serif",background:"#f0ebe4"}}>

      {/* ── SIDEBAR ── */}
      <aside style={{width:240,background:"#1a1208",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"24px 20px 20px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <Image src="/images/logo.png" alt="Elara" width={90} height={40} style={{height:38,width:"auto"}} />
          <p style={{fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:"#9b7e6e",marginTop:8}}>Admin Panel</p>
        </div>
        <nav style={{flex:1,padding:"8px 0"}}>
          {SIDEBAR.map(({section,items})=>(
            <div key={section}>
              <p style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a3a30",padding:"16px 20px 6px"}}>{section}</p>
              {items.map(item=>(
                <button key={item.id} onClick={()=>setTab(item.id as Tab)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 20px",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",textAlign:"left",background:tab===item.id?"rgba(155,126,110,.18)":"transparent",color:tab===item.id?"white":"#9b7e6e",borderLeft:tab===item.id?"3px solid #9b7e6e":"3px solid transparent",cursor:"pointer",border:"none",transition:"all .2s"}}>
                  <span style={{fontSize:14,minWidth:16}}>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <button onClick={()=>window.open("/","_blank")} style={{width:"100%",padding:"8px",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",background:"transparent",border:"1px solid rgba(255,255,255,.15)",color:"#9b7e6e",cursor:"pointer",marginBottom:8}}>
            ↗ View Store
          </button>
          <button onClick={logout} style={{width:"100%",padding:"8px",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"#6b5c54",cursor:"pointer"}}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,overflowY:"auto",minHeight:"100vh"}}>

        {/* TOP BAR */}
        <div style={{background:"white",borderBottom:"1px solid #ece5de",padding:"16px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,color:"#1a1208"}}>
            {SIDEBAR.flatMap(s=>s.items).find(i=>i.id===tab)?.label || "Admin"}
          </h1>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#9b7e6e",letterSpacing:".1em"}}>elarawear.vercel.app</span>
            <button onClick={()=>window.open("/","_blank")} style={{padding:"7px 16px",background:"#f5f0ea",border:"1px solid #ece5de",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",color:"#2c2420"}}>Preview Site ↗</button>
          </div>
        </div>

        <div style={{padding:"32px 36px"}}>

        {/* ─── DASHBOARD ─── */}
        {tab==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              {[{icon:"◇",num:products.length,label:"Total Products",c:"#9b7e6e"},{icon:"✓",num:inStock,label:"In Stock",c:"#4CAF50"},{icon:"✦",num:orders.length,label:"Total Orders",c:"#2196F3"},{icon:"⏳",num:pending,label:"Pending Orders",c:"#FF9800"}].map(s=>(
                <div key={s.label} style={{background:"white",padding:"24px 20px",borderRadius:4,border:"1px solid #ece5de"}}>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:s.c,marginBottom:4}}>{s.icon}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:300,color:"#1a1208",lineHeight:1}}>{s.num}</p>
                  <p style={{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginTop:6}}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{background:"white",border:"1px solid #ece5de",padding:"24px"}}>
                <p style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Quick Actions</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[{label:"Edit Hero Section",t:"page_hero"},{label:"Manage Products",t:"products"},{label:"Customize Design",t:"design_typography"},{label:"View Orders",t:"orders"},{label:"Store Settings",t:"settings"}].map(a=>(
                    <button key={a.t} onClick={()=>setTab(a.t as Tab)} style={{padding:"10px 16px",textAlign:"left",background:"#f5f0ea",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".1em",cursor:"pointer",color:"#2c2420",transition:"background .2s"}}>→ {a.label}</button>
                  ))}
                </div>
              </div>
              <div style={{background:"white",border:"1px solid #ece5de",padding:"24px"}}>
                <p style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Recent Orders</p>
                {orders.length===0
                  ? <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontStyle:"italic",color:"#c9b9ae"}}>No orders yet</p>
                  : orders.slice(0,4).map(o=>(
                    <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #ece5de"}}>
                      <div><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16}}>{o.customer_name}</p><p style={{fontSize:10,color:"#9b7e6e",letterSpacing:".1em"}}>{o.customer_phone}</p></div>
                      <div style={{textAlign:"right"}}><p style={{fontSize:14,color:"#2c2420"}}>PKR {o.total?.toLocaleString()}</p><span style={{padding:"2px 8px",background:o.status==="pending"?"#fff8e1":o.status==="completed"?"#e8f5e9":"#fce4ec",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:o.status==="pending"?"#f57f17":o.status==="completed"?"#2e7d32":"#c62828"}}>{o.status}</span></div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* ─── DESIGN: TYPOGRAPHY ─── */}
        {tab==="design_typography"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:24}}>Font Sizes</p>
              {D("Heading 1 (Hero)",design.font_size_h1,32,120,"px","font_size_h1")}
              {D("Heading 2 (Section)",design.font_size_h2,24,80,"px","font_size_h2")}
              {D("Heading 3 (Card)",design.font_size_h3,14,48,"px","font_size_h3")}
              {D("Body Text",design.font_size_body,12,24,"px","font_size_body")}
              {D("Labels / Small",design.font_size_small,8,16,"px","font_size_small")}
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:20}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Font Weight & Spacing</p>
                {D("Display Font Weight",design.font_weight_display,100,700,"","font_weight_display")}
                {D("Heading Letter Spacing",design.letter_spacing_heading,-5,10,"  /100em","letter_spacing_heading")}
                {D("Label Letter Spacing",design.letter_spacing_label,10,60,"  /100em","letter_spacing_label")}
                {D("Body Line Height",design.line_height_body,120,220,"  /100","line_height_body")}
              </div>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Live Preview</p>
              <div style={{padding:24,background:"#faf8f5",border:"1px solid #ece5de"}}>
                <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:design.font_size_h1,fontWeight:design.font_weight_display,letterSpacing:`${design.letter_spacing_heading/100}em`,color:"#1a1208",marginBottom:12,lineHeight:1.05}}>Dressed in Grace</h1>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:design.font_size_h2,fontWeight:design.font_weight_display,color:"#2c2420",marginBottom:12}}>Featured Pieces</h2>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:design.font_size_h3,fontWeight:design.font_weight_display,color:"#2c2420",marginBottom:12}}>Layla Wrap Set</h3>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:design.font_size_body,lineHeight:design.line_height_body/100,color:"#6b5c54",marginBottom:12}}>Discover timeless modest fashion curated for the modern woman who values elegance without compromise.</p>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:design.font_size_small,letterSpacing:`${design.letter_spacing_label/100}em`,textTransform:"uppercase",color:"#9b7e6e"}}>Co-ord Sets · New Collection</p>
              </div>
              <button onClick={saveDesign} disabled={saving} style={{width:"100%",marginTop:20,padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save & Publish Changes"}</button>
            </div>
          </div>
        )}

        {/* ─── DESIGN: COLORS ─── */}
        {tab==="design_colors"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Brand Colors</p>
              {C("Primary (Buttons, Text)","#2c2420","color_primary")}
              {C("Accent (Highlights, Labels)",design.color_accent,"color_accent")}
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:8}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Backgrounds</p>
                {C("Page Background",design.color_background,"color_background")}
                {C("Surface / Cards",design.color_surface,"color_surface")}
                {C("Dark Section",design.color_dark,"color_dark")}
              </div>
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:8}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Text Colors</p>
                {C("Main Text",design.color_text,"color_text")}
                {C("Muted Text",design.color_muted,"color_muted")}
                {C("Border",design.color_border,"color_border")}
              </div>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Color Preview</p>
              <div style={{padding:0,overflow:"hidden",border:"1px solid #ece5de"}}>
                <div style={{background:design.color_dark,padding:"20px 24px"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:"#d4bfb4"}}>2,400+</p><p style={{fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:design.color_accent,marginTop:6}}>Happy Customers</p></div>
                <div style={{background:design.color_background,padding:"20px 24px"}}><p style={{fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:design.color_accent,marginBottom:8}}>Curated for You</p><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,color:design.color_dark,marginBottom:12}}>Featured Pieces</p><div style={{width:32,height:1,background:design.color_accent}} /></div>
                <div style={{background:design.color_surface,padding:"20px 24px"}}><div style={{display:"flex",gap:8}}><button style={{background:design.color_primary,color:design.color_background,border:"none",padding:"10px 20px",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:design.border_radius}}>Shop Now</button><button style={{background:"transparent",color:design.color_primary,border:`1px solid ${design.color_primary}`,padding:"10px 20px",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:design.border_radius}}>Our Story</button></div></div>
                <div style={{background:"white",padding:"12px 24px",borderTop:`1px solid ${design.color_border}`}}><p style={{fontFamily:"'Jost',sans-serif",fontSize:12,color:design.color_text}}>Body text in main color</p><p style={{fontFamily:"'Jost',sans-serif",fontSize:12,color:design.color_muted}}>Muted / secondary text</p></div>
              </div>
              <button onClick={saveDesign} disabled={saving} style={{width:"100%",marginTop:20,padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save & Publish Colors"}</button>
            </div>
          </div>
        )}

        {/* ─── DESIGN: SPACING & LAYOUT ─── */}
        {tab==="design_spacing"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Section Spacing</p>
              {D("Section Vertical Padding",design.section_padding_y,20,160,"px","section_padding_y")}
              {D("Section Horizontal Padding",design.section_padding_x,16,160,"px","section_padding_x")}
              {D("Card Padding",design.card_padding,16,80,"px","card_padding")}
              {D("Grid Gap",design.grid_gap,8,64,"px","grid_gap")}
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:12}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Layout</p>
                {D("Max Container Width",design.max_width,800,1600,"px","max_width")}
                {D("Navbar Height",design.navbar_height,52,100,"px","navbar_height")}
                {D("Hero Min Height",design.hero_min_height,50,100,"vh","hero_min_height")}
              </div>
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:12}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Buttons & Borders</p>
                {D("Button Horizontal Padding",design.button_padding_x,10,80,"px","button_padding_x")}
                {D("Button Vertical Padding",design.button_padding_y,6,30,"px","button_padding_y")}
                {D("Border Radius",design.border_radius,0,20,"px","border_radius")}
              </div>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Spacing Preview</p>
              <div style={{border:"1px solid #ece5de",overflow:"hidden"}}>
                <div style={{background:"#f5f0ea",padding:`${design.section_padding_y/3}px ${design.section_padding_x/3}px`}}>
                  <p style={{fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:8}}>Section Label</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:"#1a1208"}}>Section Heading</p>
                  <div style={{width:28,height:1,background:"#9b7e6e",marginTop:10}} />
                </div>
                <div style={{padding:`${design.section_padding_y/3}px ${design.section_padding_x/3}px`}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:design.grid_gap/2}}>
                    {[1,2].map(i=>(
                      <div key={i} style={{background:"#f5f0ea",padding:design.card_padding/2}}>
                        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"#1a1208",marginBottom:6}}>Product Name</p>
                        <p style={{fontSize:11,color:"#9b7e6e"}}>PKR 8,500</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{marginTop:16,display:"flex",gap:10}}>
                <button style={{padding:`${design.button_padding_y}px ${design.button_padding_x}px`,background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:design.border_radius}}>Shop Now</button>
                <button style={{padding:`${design.button_padding_y}px ${design.button_padding_x}px`,background:"transparent",color:"#2c2420",border:"1px solid #2c2420",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:design.border_radius}}>Learn More</button>
              </div>
              <button onClick={saveDesign} disabled={saving} style={{width:"100%",marginTop:20,padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save & Publish Layout"}</button>
            </div>
          </div>
        )}

        {/* ─── PAGE: HERO ─── */}
        {tab==="page_hero"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:24}}>Hero Section Content</p>
              {S("Main Headline",settings.hero_headline,"hero_headline","text",3)}
              <p style={{fontSize:10,color:"#9b7e6e",marginTop:-14,marginBottom:20}}>Use new line for line break</p>
              {S("Subtitle Text",settings.hero_subtitle,"hero_subtitle","text",3)}
              {S("Primary Button Text",settings.hero_btn1_text,"hero_btn1_text")}
              {S("Secondary Button Text",settings.hero_btn2_text,"hero_btn2_text")}
              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:8}}>Hero Banner Image</label>
                <div style={{display:"flex",gap:12,alignItems:"start"}}>
                  <img src={settings.hero_image||"/images/hero.jpeg"} alt="hero" style={{width:80,height:60,objectFit:"cover",border:"1px solid #ece5de",flexShrink:0}} />
                  <div style={{flex:1}}>
                    <input value={settings.hero_image} onChange={e=>setSettings(s=>({...s,hero_image:e.target.value}))} placeholder="/images/hero.jpeg" style={{width:"100%",border:"1px solid #ece5de",padding:"8px 12px",fontFamily:"'Jost',sans-serif",fontSize:12,marginBottom:8}} />
                    <label style={{display:"inline-block",padding:"7px 16px",border:"1px solid #ece5de",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",color:"#2c2420"}}>
                      {uploading?"Uploading...":"Upload Image"}
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadImage(f,url=>setSettings(s=>({...s,hero_image:url})));}} />
                    </label>
                  </div>
                </div>
              </div>
              <button onClick={saveSettings} disabled={saving} style={{width:"100%",padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save Hero Section"}</button>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Hero Preview</p>
              <div style={{border:"1px solid #ece5de",overflow:"hidden",background:"#faf8f5"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:280}}>
                  <div style={{padding:"24px 20px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <p style={{fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:10}}>New Collection 2026</p>
                    <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,lineHeight:1.1,color:"#1a1208",marginBottom:10,whiteSpace:"pre-line"}}>{settings.hero_headline}</h1>
                    <div style={{width:28,height:1,background:"#9b7e6e",marginBottom:10}} />
                    <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,lineHeight:1.7,color:"#6b5c54",marginBottom:16}}>{settings.hero_subtitle?.slice(0,80)}...</p>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{padding:"7px 14px",background:"#2c2420",color:"white",fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".15em",textTransform:"uppercase"}}>{settings.hero_btn1_text}</span>
                      <span style={{padding:"7px 14px",border:"1px solid #2c2420",fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"#2c2420"}}>{settings.hero_btn2_text}</span>
                    </div>
                  </div>
                  <div style={{position:"relative",overflow:"hidden"}}>
                    <img src={settings.hero_image||"/images/hero.jpeg"} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PAGE: SECTIONS ─── */}
        {tab==="page_sections"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:24}}>Section Visibility</p>
              {S("Stats Bar",settings.show_stats,"show_stats","checkbox")}
              {S("Style Guide Section",settings.show_style_section,"show_style_section","checkbox")}
              {S("Testimonials Section",settings.show_testimonials,"show_testimonials","checkbox")}
              <div style={{borderTop:"1px solid #ece5de",paddingTop:20,marginTop:8}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Stats Section Content</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {(["stat1_num","stat1_label","stat2_num","stat2_label","stat3_num","stat3_label","stat4_num","stat4_label"] as (keyof SiteSettings)[]).map(k=>(
                    <div key={k}>
                      <label style={{display:"block",fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:4}}>{k.replace(/_/g," ")}</label>
                      <input value={String(settings[k]||"")} onChange={e=>setSettings(ss=>({...ss,[k]:e.target.value}))} style={{width:"100%",border:"1px solid #ece5de",padding:"8px 10px",fontFamily:"'Jost',sans-serif",fontSize:12}} />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={saveSettings} disabled={saving} style={{width:"100%",marginTop:24,padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save Sections"}</button>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Stats Preview</p>
              <div style={{background:"#2c2420",padding:"24px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                {[[settings.stat1_num,settings.stat1_label],[settings.stat2_num,settings.stat2_label],[settings.stat3_num,settings.stat3_label],[settings.stat4_num,settings.stat4_label]].map(([n,l],i)=>(
                  <div key={i} style={{textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,.1)":"none"}}>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:"#d4bfb4",lineHeight:1}}>{n}</p>
                    <p style={{fontFamily:"'Jost',sans-serif",fontSize:8,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginTop:6}}>{l}</p>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16,padding:16,background:"#f5f0ea",border:"1px solid #ece5de"}}>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:4}}>Section Visibility</p>
                {[["Stats Bar",settings.show_stats],["Style Guide",settings.show_style_section],["Testimonials",settings.show_testimonials]].map(([l,v])=>(
                  <div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #ece5de"}}>
                    <span style={{fontFamily:"'Jost',sans-serif",fontSize:12,color:"#2c2420"}}>{l as string}</span>
                    <span style={{padding:"2px 10px",background:v?"#e8f5e9":"#fce4ec",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:v?"#2e7d32":"#c62828"}}>{v?"Visible":"Hidden"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PAGE: FOOTER ─── */}
        {tab==="page_footer"&&(
          <div style={{maxWidth:640}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:24}}>Footer Content</p>
              {S("Footer Tagline",settings.footer_tagline,"footer_tagline")}
              {S("Store Name",settings.store_name,"store_name")}
              <button onClick={saveSettings} disabled={saving} style={{width:"100%",marginTop:8,padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save Footer"}</button>
            </div>
          </div>
        )}

        {/* ─── PRODUCTS LIST ─── */}
        {tab==="products"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300}}>Products ({products.length})</p>
              <button onClick={()=>{setEditProd({name:"",description:"",price:0,category:"Co-ord Sets",in_stock:true,colors:["Maroon"],sizes:["XS","S","M","L","XL"],images:["/images/pd1.jpg","/images/pd2.jpg","/images/p1.png","/images/p2.png"]});setTab("add_product");}} style={{padding:"10px 24px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer"}}>+ Add Product</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {products.map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:16,background:"white",border:"1px solid #ece5de",padding:"14px 18px"}}>
                  <img src={p.images[0]} alt={p.name} style={{width:56,height:70,objectFit:"cover",flexShrink:0}} />
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19}}>{p.name}</p>
                    <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".1em",color:"#9b7e6e",marginTop:2}}>{p.category} · PKR {p.price.toLocaleString()}{p.badge?` · ${p.badge}`:""}</p>
                  </div>
                  <span style={{padding:"3px 10px",fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".12em",textTransform:"uppercase",background:p.in_stock?"#e8f5e9":"#fce4ec",color:p.in_stock?"#2e7d32":"#c62828"}}>{p.in_stock?"In Stock":"Sold Out"}</span>
                  <button onClick={()=>{setEditProd({...p});setTab("add_product");}} style={{padding:"7px 16px",border:"1px solid #ece5de",background:"transparent",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",color:"#2c2420"}}>Edit</button>
                  <button onClick={()=>deleteProduct(p.id)} style={{padding:"7px 16px",border:"1px solid #fde",background:"#fdecea",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",color:"#c62828"}}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ADD / EDIT PRODUCT ─── */}
        {tab==="add_product"&&editProd&&(
          <div>
            <button onClick={()=>{setEditProd(null);setTab("products");}} style={{background:"none",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",cursor:"pointer",marginBottom:20}}>← Back to Products</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>{editProd.id?"Edit Product":"New Product"}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {[["Product Name","name","text"],["Price (PKR)","price","number"],["Original Price","original_price","number"]].map(([l,k,t])=>(
                    <div key={k} style={{gridColumn:k==="name"?"1/-1":"auto"}}>
                      <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>{l}</label>
                      <input type={t} value={(editProd as Record<string,unknown>)[k] as string||""} onChange={e=>setEditProd(p=>({...p,[k]:t==="number"?Number(e.target.value):e.target.value}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13}} />
                    </div>
                  ))}
                  <div>
                    <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>Category</label>
                    <select value={editProd.category||"Co-ord Sets"} onChange={e=>setEditProd(p=>({...p,category:e.target.value}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13}}>
                      {["Co-ord Sets","Occasion Wear","Casual Wear"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>Badge</label>
                    <select value={editProd.badge||""} onChange={e=>setEditProd(p=>({...p,badge:e.target.value||undefined}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13}}>
                      {["","New","Bestseller","Sale","Featured","Limited"].map(b=><option key={b} value={b}>{b||"None"}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>Description</label>
                  <textarea rows={4} value={editProd.description||""} onChange={e=>setEditProd(p=>({...p,description:e.target.value}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13,resize:"vertical"}} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>Colors (comma separated)</label>
                    <input value={(editProd.colors||[]).join(", ")} onChange={e=>setEditProd(p=>({...p,colors:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13}} placeholder="Maroon, Navy, Mocha" />
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:6}}>Sizes (comma separated)</label>
                    <input value={(editProd.sizes||[]).join(", ")} onChange={e=>setEditProd(p=>({...p,sizes:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} style={{width:"100%",border:"1px solid #ece5de",padding:"9px 12px",fontFamily:"'Jost',sans-serif",fontSize:13}} placeholder="XS, S, M, L, XL" />
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:11,color:"#2c2420"}}>
                    <input type="checkbox" checked={editProd.in_stock??true} onChange={e=>setEditProd(p=>({...p,in_stock:e.target.checked}))} style={{width:18,height:18,accentColor:"#9b7e6e"}} />
                    In Stock
                  </label>
                </div>
                <button onClick={()=>saveProduct(editProd)} disabled={saving} style={{width:"100%",padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":(editProd.id?"Update Product":"Add Product")}</button>
              </div>
              <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
                <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Product Images (4 max)</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[0,1,2,3].map(i=>(
                    <div key={i}>
                      <div style={{position:"relative",aspectRatio:"3/4",background:"#f5f0ea",overflow:"hidden",border:"1px solid #ece5de",marginBottom:6}}>
                        {editProd.images?.[i]&&<img src={editProd.images[i]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />}
                        {!editProd.images?.[i]&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:"#c9b9ae"}}>{i+1}</div>}
                      </div>
                      <input value={editProd.images?.[i]||""} onChange={e=>{const imgs=[...(editProd.images||[])];imgs[i]=e.target.value;setEditProd(p=>({...p,images:imgs}));}} placeholder="Image URL" style={{width:"100%",border:"1px solid #ece5de",padding:"6px 8px",fontFamily:"'Jost',sans-serif",fontSize:11,marginBottom:4}} />
                      <label style={{display:"block",textAlign:"center",fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"#9b7e6e",cursor:"pointer",padding:"5px 0",border:"1px solid #ece5de"}}>
                        {uploading?"Uploading...":"Upload Image"}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadImage(f,url=>{const imgs=[...(editProd.images||[])];imgs[i]=url;setEditProd(p=>({...p,images:imgs}));});}} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {tab==="orders"&&(
          <div>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              {["all","pending","confirmed","shipped","completed","cancelled"].map(s=>(
                <button key={s} onClick={()=>setFilterStatus(s)} style={{padding:"7px 16px",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",border:"1px solid #ece5de",background:filterStatus===s?"#2c2420":"transparent",color:filterStatus===s?"white":"#2c2420",cursor:"pointer"}}>{s}</button>
              ))}
            </div>
            {(filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus)).length===0
              ? <div style={{background:"white",border:"1px solid #ece5de",padding:"60px",textAlign:"center"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontStyle:"italic",color:"#9b7e6e"}}>No orders found</p></div>
              : (filterStatus==="all"?orders:orders.filter(o=>o.status===filterStatus)).map(o=>(
                <div key={o.id} style={{background:"white",border:"1px solid #ece5de",padding:"20px 24px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                    <div>
                      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>{o.customer_name}</p>
                      <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"#9b7e6e",letterSpacing:".1em",marginTop:2}}>{o.customer_phone} · {o.customer_email} · {new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22}}>PKR {o.total?.toLocaleString()}</span>
                      <select value={o.status} onChange={async e=>{await fetch(`/api/orders/${o.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:e.target.value})});setOrders(prev=>prev.map(x=>x.id===o.id?{...x,status:e.target.value}:x));toast.success("Status updated ✓");}}
                        style={{border:"1px solid #ece5de",padding:"7px 12px",fontFamily:"'Jost',sans-serif",fontSize:11,cursor:"pointer"}}>
                        {["pending","confirmed","shipped","completed","cancelled"].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  {Array.isArray(o.items)&&o.items.length>0&&(
                    <div style={{background:"#f5f0ea",padding:"10px 14px",display:"flex",flexWrap:"wrap",gap:8}}>
                      {o.items.map((item,i)=>(
                        <span key={i} style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"#6b5c54",background:"white",padding:"3px 10px",border:"1px solid #ece5de"}}>{(item as {name:string;qty:number}).name} ×{(item as {name:string;qty:number}).qty}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {tab==="settings"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Store Information</p>
              {S("Store Name",settings.store_name,"store_name")}
              {S("Email Address",settings.email,"email","email")}
              {S("WhatsApp Number",settings.whatsapp,"whatsapp")}
              {S("Instagram Handle",settings.instagram,"instagram")}
              {S("Store Address",settings.address,"address")}
              {S("Free Shipping Threshold (PKR)",settings.free_shipping_threshold,"free_shipping_threshold","number")}
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:20}}>Admin Access</p>
              <div style={{background:"#f5f0ea",padding:20,marginBottom:20,border:"1px solid #ece5de"}}>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:12,color:"#6b5c54",lineHeight:1.8}}>
                  <strong>Admin URL:</strong> /admin (direct navigation only)<br/>
                  <strong>Hidden from:</strong> All public pages, no links visible<br/>
                  <strong>Secret shortcut:</strong> Type <code style={{background:"white",padding:"1px 6px",border:"1px solid #ece5de"}}>elaraadmin</code> on any page<br/>
                  <strong>Password:</strong> Set via <code style={{background:"white",padding:"1px 6px",border:"1px solid #ece5de"}}>ADMIN_PASSWORD</code> env var<br/>
                  <strong>Session:</strong> 7 days (httpOnly cookie)
                </p>
              </div>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:12}}>Change Password</p>
              <p style={{fontFamily:"'Jost',sans-serif",fontSize:12,color:"#6b5c54",marginBottom:16,lineHeight:1.7}}>Update <strong>ADMIN_PASSWORD</strong> in your Vercel environment variables → Redeploy. Do not share your admin URL.</p>
              <button onClick={saveSettings} disabled={saving} style={{width:"100%",padding:"14px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>{saving?"Saving...":"Save Settings"}</button>
            </div>
          </div>
        )}

        {/* ─── MEDIA LIBRARY ─── */}
        {tab==="media"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300}}>Media Library</p>
              <label style={{padding:"10px 24px",background:"#2c2420",color:"white",border:"none",fontFamily:"'Jost',sans-serif",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer"}}>
                {uploading?"Uploading...":"Upload Images"}
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files||[]).forEach(f=>uploadImage(f,()=>{}));}} />
              </label>
            </div>
            <div style={{background:"white",border:"1px solid #ece5de",padding:"28px 24px"}}>
              <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"#9b7e6e",marginBottom:16}}>Default Product Images</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
                {["/images/hero.jpeg","/images/p1.png","/images/p2.png","/images/p3.png","/images/p4.png","/images/pd1.jpg","/images/pd2.jpg","/images/pd3.jpg"].map(src=>(
                  <div key={src} style={{position:"relative",aspectRatio:"1",overflow:"hidden",border:"1px solid #ece5de",cursor:"pointer"}} onClick={()=>{navigator.clipboard?.writeText(src);toast.success(`Copied: ${src}`);}}>
                    <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"white",fontFamily:"'Jost',sans-serif",transition:"background .2s"}} className="hover:bg-black/40">
                    </div>
                  </div>
                ))}
              </div>
              <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"#9b7e6e",marginTop:16,textAlign:"center"}}>Click any image to copy its URL path · Connect Supabase to upload new images</p>
            </div>
          </div>
        )}

        </div>
      </main>
    </div>
  );
}
