'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { commercialProducts } from '@/lib/commercial-catalog';

export type CartItem = { productId: string; color: string; quantity: number };
type CartApi = { items: CartItem[]; add: (id:string,color:string,quantity:number)=>void; update:(id:string,color:string,quantity:number)=>void; clear:()=>void; ready:boolean };
const CartContext = createContext<CartApi | null>(null);
const STORAGE = 'vektua-cart-v2';
const LEGACY = 'vektua-demo-cart-v1';
const MAX_QTY = 99;
const valid = (item:unknown):item is CartItem => {
  if (!item || typeof item !== 'object') return false;
  const i = item as Partial<CartItem>;
  return typeof i.productId === 'string' && commercialProducts.some(p => p.id === i.productId) &&
    typeof i.color === 'string' && i.color.length > 0 && i.color.length <= 100 &&
    Number.isInteger(i.quantity) && Number(i.quantity) > 0 && Number(i.quantity) <= MAX_QTY;
};
export function CartProvider({children}:{children:ReactNode}) {
  const [items,setItems] = useState<CartItem[]>([]);
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    let active = true;
    queueMicrotask(()=>{
      if(!active)return;
      try {
        const parsed:unknown = JSON.parse(sessionStorage.getItem(STORAGE) || sessionStorage.getItem(LEGACY) || '[]');
        if(Array.isArray(parsed)) setItems(parsed.filter(valid).slice(0,100));
      } catch { /* Unavailable or invalid browser storage: use in-memory cart. */ }
      setReady(true);
    });
    return()=>{active=false;};
  },[]);
  useEffect(()=>{ if(ready) { try { sessionStorage.setItem(STORAGE,JSON.stringify(items)); sessionStorage.removeItem(LEGACY); } catch { /* In-memory cart remains usable. */ } } },[items,ready]);
  const add = (id:string,color:string,quantity:number) => {
    if(!commercialProducts.some(p=>p.id===id) || !color.trim() || color.length>100 || !Number.isInteger(quantity) || quantity<1) return;
    setItems(old=>{
      const found=old.find(x=>x.productId===id&&x.color===color);
      if(found) return old.map(x=>x===found?{...x,quantity:Math.min(MAX_QTY,x.quantity+quantity)}:x);
      if(old.length>=100) return old;
      return [...old,{productId:id,color,quantity:Math.min(MAX_QTY,quantity)}];
    });
  };
  const update = (id:string,color:string,quantity:number) => {
    if(!Number.isInteger(quantity)) return;
    setItems(old=>quantity<=0 ? old.filter(x=>!(x.productId===id&&x.color===color)) : old.map(x=>x.productId===id&&x.color===color?{...x,quantity:Math.min(MAX_QTY,quantity)}:x));
  };
  return <CartContext.Provider value={{items,add,update,clear:()=>setItems([]),ready}}>{children}</CartContext.Provider>;
}
export const useCart=()=>{const cart=useContext(CartContext);if(!cart)throw new Error('CartProvider required');return cart;};
