import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { defaultDesign } from "@/lib/data";
import { DesignTokens } from "@/lib/types";

export const metadata: Metadata = {
  title: "Elara Modest Wear | Timeless Modest Fashion",
  description: "Discover timeless modest fashion curated for the modern woman.",
  robots: "index, follow",
};

async function getDesignTokens(): Promise<DesignTokens> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/design`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch {}
  return defaultDesign;
}

function buildCssVars(d: DesignTokens): string {
  return `:root {
    --fs-h1:${d.font_size_h1}px; --fs-h2:${d.font_size_h2}px; --fs-h3:${d.font_size_h3}px;
    --fs-body:${d.font_size_body}px; --fs-small:${d.font_size_small}px;
    --fw-display:${d.font_weight_display}; --ls-heading:${d.letter_spacing_heading / 100}em; --ls-label:${d.letter_spacing_label / 100}em;
    --lh-body:${d.line_height_body / 100};
    --c-primary:${d.color_primary}; --c-accent:${d.color_accent};
    --c-bg:${d.color_background}; --c-surface:${d.color_surface};
    --c-dark:${d.color_dark}; --c-text:${d.color_text}; --c-muted:${d.color_muted}; --c-border:${d.color_border};
    --sp-section-y:${d.section_padding_y}px; --sp-section-x:${d.section_padding_x}px;
    --sp-card:${d.card_padding}px; --sp-gap:${d.grid_gap}px; --nav-h:${d.navbar_height}px;
    --max-w:${d.max_width}px; --hero-h:${d.hero_min_height}vh;
    --radius:${d.border_radius}px; --btn-px:${d.button_padding_x}px; --btn-py:${d.button_padding_y}px;
  }`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const design = await getDesignTokens();
  const cssVars = buildCssVars(design);
  return (
    <html lang="en">
      <head><style dangerouslySetInnerHTML={{ __html: cssVars }} /></head>
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily:"'Jost',sans-serif", fontSize:"13px", background:"#2c2420", color:"#faf8f5", borderRadius:"0" } }} />
      </body>
    </html>
  );
}
