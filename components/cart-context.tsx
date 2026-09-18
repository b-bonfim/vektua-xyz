'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products } from '@/lib/catalog';
export type CartItem = { productId: string; color: string; quantity: number };
type CartApi = { items: CartItem[]; add: (id:string,color:string,quantity:number)=>void; update:(id:string,color:string,quantity:number)=>void; clear:()=>void; ready:boolean };
const CartContext = createContext<CartApi | null>(null);
const STORAGE = 'vektua-demo-cart-v1';
export function CartProvider({children}:{children:ReactNode}) {
  const [items,setItems] = useState<CartItem[]>([]);
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    try { const parsed = JSON.parse(sessionStorage.getItem(STORAGE)||'[]');
      if(Array.isArray(parsed)) setItems(parsed.filter((x):x is CartItem => !!x && typeof x==='object' && products.some(p=>p.id===x.productId && p.colors.includes(x.color)) && Number.isInteger(x.quantity) && x.quantity>0 && x.quantity<=10).slice(0,30));
    } catch { /* Storage unavailable or invalid: use an empty cart. */ }
    setReady(true);
  },[]);
  useEffect(()=>{ if(ready) { try { sessionStorage.setItem(STORAGE,JSON.stringify(items)); } catch { /* In-memory demo remains usable. */ } } },[items,ready]);
  const add = (id:string,color:string,quantity:number) => {
    if(!products.some(p=>p.id===id && p.colors.includes(color)) || !Number.isInteger(quantity)) return;
    setItems(old=>{ const found=old.find(x=>x.productId===id&&x.color===color); return found ? old.map(x=>x===found?{...x,quantity:Math.min(10,x.quantity+Math.max(1,quantity))}:x) : [...old,{productId:id,color,quantity:Math.max(1,Math.min(10,quantity))}]; });
  };
  const update = (id:string,color:string,quantity:number)=>setItems(old=>quantity<=0?old.filter(x=>!(x.productId===id&&x.color===color)):old.map(x=>x.productId===id&&x.color===color?{...x,quantity:Math.min(10,quantity)}:x));
  return <CartContext.Provider value={{items,add,update,clear:()=>setItems([]),ready}}>{children}</CartContext.Provider>;
}
export const useCart=()=>{const cart=useContext(CartContext);if(!cart)throw new Error('CartProvider required');return cart;};
