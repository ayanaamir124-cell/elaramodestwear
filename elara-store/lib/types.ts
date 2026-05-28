export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  badge?: string;
  in_stock: boolean;
  colors: string[];
  sizes: string[];
  images: string[];
  created_at?: string;
}

export interface CartItem extends Product {
  qty: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
}

export interface DesignTokens {
  // Typography
  font_size_h1: number;
  font_size_h2: number;
  font_size_h3: number;
  font_size_body: number;
  font_size_small: number;
  font_weight_display: number;
  letter_spacing_heading: number;
  letter_spacing_label: number;
  line_height_body: number;
  // Colors
  color_primary: string;
  color_accent: string;
  color_background: string;
  color_surface: string;
  color_dark: string;
  color_charcoal: string;
  color_text: string;
  color_muted: string;
  color_border: string;
  // Spacing
  section_padding_y: number;
  section_padding_x: number;
  card_padding: number;
  grid_gap: number;
  navbar_height: number;
  // Layout
  max_width: number;
  hero_min_height: number;
  border_radius: number;
  button_padding_x: number;
  button_padding_y: number;
}

export interface SiteSettings {
  hero_headline: string;
  hero_subtitle: string;
  hero_image: string;
  hero_btn1_text: string;
  hero_btn2_text: string;
  store_name: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  free_shipping_threshold: number;
  footer_tagline: string;
  show_testimonials: boolean;
  show_stats: boolean;
  show_style_section: boolean;
  stat1_num: string;
  stat1_label: string;
  stat2_num: string;
  stat2_label: string;
  stat3_num: string;
  stat3_label: string;
  stat4_num: string;
  stat4_label: string;
}
