"use client";
import { create } from "zustand";
import { CartItem, Product } from "./types";
interface CartStore {
  items: CartItem[]; isOpen: boolean;
  addItem: (p: Product, size: string, color: string) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQty: (id: string, size: string, color: string, qty: number) => void;
  clearCart: () => void; toggleCart: () => void;
  total: () => number; count: () => number;
}
export const useCartStore = create<CartStore>((set, get) => ({
  items: [], isOpen: false,
  addItem: (product, size, color) => set((s) => {
    const ex = s.items.find(i => i.id===product.id && i.selectedSize===size && i.selectedColor===color);
    if (ex) return { items: s.items.map(i => i.id===product.id && i.selectedSize===size && i.selectedColor===color ? {...i,qty:i.qty+1} : i) };
    return { items: [...s.items, {...product, qty:1, selectedSize:size, selectedColor:color}] };
  }),
  removeItem: (id,size,color) => set(s => ({ items: s.items.filter(i => !(i.id===id&&i.selectedSize===size&&i.selectedColor===color)) })),
  updateQty: (id,size,color,qty) => set(s => ({ items: qty<=0 ? s.items.filter(i=>!(i.id===id&&i.selectedSize===size&&i.selectedColor===color)) : s.items.map(i=>i.id===id&&i.selectedSize===size&&i.selectedColor===color?{...i,qty}:i) })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
  total: () => get().items.reduce((s,i)=>s+i.price*i.qty,0),
  count: () => get().items.reduce((s,i)=>s+i.qty,0),
}));
