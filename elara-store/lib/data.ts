import { Product, SiteSettings, DesignTokens } from "./types";

export const defaultProducts: Product[] = [
  { id:"1", name:"Layla Wrap Set", description:"The Layla Wrap Set features an elegant tie-front wrap top with a structured peplum hem, paired with a graceful A-line maxi skirt. Crafted from premium matte fabric for a refined, modest silhouette.", price:8500, original_price:10500, category:"Co-ord Sets", badge:"Bestseller", in_stock:true, colors:["Maroon","Navy","Mocha"], sizes:["XS","S","M","L","XL"], images:["/images/pd1.jpg","/images/pd2.jpg","/images/pd3.jpg","/images/p1.png"] },
  { id:"2", name:"Nour Navy Set", description:"The Nour Collection in deep Navy brings sophistication to everyday modest wear. The tie-waist blouse creates a flattering silhouette while the full-circle skirt adds effortless movement.", price:7800, category:"Co-ord Sets", badge:"New", in_stock:true, colors:["Navy","Black","Forest Green"], sizes:["XS","S","M","L","XL"], images:["/images/p2.png","/images/pd1.jpg","/images/pd2.jpg","/images/pd3.jpg"] },
  { id:"3", name:"Amber Mocha Set", description:"Earthy and timeless, the Amber Mocha Set in warm chocolate tones pairs a wrap top with a sweeping maxi skirt. Ideal for daytime elegance and evening gatherings.", price:8200, original_price:9500, category:"Co-ord Sets", badge:"Sale", in_stock:true, colors:["Mocha","Sage","Blush"], sizes:["XS","S","M","L","XL"], images:["/images/p3.png","/images/pd2.jpg","/images/p1.png","/images/pd3.jpg"] },
  { id:"4", name:"Zara Peplum Set", description:"The Zara Peplum Set elevates modest fashion with its layered peplum top and fluid skirt. The rich maroon tone makes this ideal for weddings and formal events.", price:8900, category:"Occasion Wear", badge:"Featured", in_stock:true, colors:["Maroon","Burgundy","Deep Rose"], sizes:["XS","S","M","L","XL"], images:["/images/p4.png","/images/pd1.jpg","/images/p2.png","/images/pd2.jpg"] },
  { id:"5", name:"Serene Taupe Set", description:"Understated and effortlessly chic, the Serene Taupe Set is your go-to for refined casual dressing. Lightweight fabric and minimal detail create a timeless look.", price:6500, category:"Casual Wear", in_stock:true, colors:["Taupe","Cream","Dusty Rose"], sizes:["XS","S","M","L","XL"], images:["/images/p1.png","/images/p3.png","/images/pd3.jpg","/images/pd1.jpg"] },
  { id:"6", name:"Celeste Evening Set", description:"The Celeste Evening Set is designed for those who want to make a statement while maintaining modesty. Luxurious fabric drapes beautifully, making every step feel graceful.", price:9800, original_price:12000, category:"Occasion Wear", badge:"Limited", in_stock:false, colors:["Midnight","Navy","Emerald"], sizes:["XS","S","M","L","XL"], images:["/images/p2.png","/images/p4.png","/images/pd2.jpg","/images/pd3.jpg"] },
];

export const defaultSettings: SiteSettings = {
  hero_headline: "Dressed in Grace,\nDefined by You",
  hero_subtitle: "Discover timeless modest fashion curated for the modern woman who values elegance without compromise.",
  hero_image: "/images/hero.jpeg",
  hero_btn1_text: "Explore Collection",
  hero_btn2_text: "Our Story",
  store_name: "Elara Modest Wear",
  whatsapp: "+92 300 1234567",
  instagram: "@elaramodestwear",
  email: "hello@elaramodestwear.com",
  address: "Karachi, Pakistan",
  free_shipping_threshold: 3000,
  footer_tagline: "Dressed in Grace",
  show_testimonials: true,
  show_stats: true,
  show_style_section: true,
  stat1_num:"2,400+", stat1_label:"Happy Customers",
  stat2_num:"150+",  stat2_label:"Unique Styles",
  stat3_num:"6",     stat3_label:"Color Palettes",
  stat4_num:"100%",  stat4_label:"Modest & Elegant",
};

export const defaultDesign: DesignTokens = {
  font_size_h1:72, font_size_h2:44, font_size_h3:24,
  font_size_body:15, font_size_small:11,
  font_weight_display:300, letter_spacing_heading:-1, letter_spacing_label:30,
  line_height_body:185,
  color_primary:"#2c2420", color_accent:"#9b7e6e",
  color_background:"#faf8f5", color_surface:"#f5f0ea",
  color_dark:"#1a1208", color_charcoal:"#2c2420",
  color_text:"#2c2420", color_muted:"#6b5c54", color_border:"#ece5de",
  section_padding_y:96, section_padding_x:80,
  card_padding:40, grid_gap:24, navbar_height:72,
  max_width:1280, hero_min_height:100,
  border_radius:0, button_padding_x:36, button_padding_y:13,
};
