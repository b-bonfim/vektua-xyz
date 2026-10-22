'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/whatsapp';

export function WhatsAppContact() {
  const pathname = usePathname();

  // Campaign microsurfaces: leave partner artwork free of Vektua commerce overlays.
  if (/^\/congrats\/(orion-tattoo|a-padoca|algodao-pesado|agodao-pesado)\/?$/.test(pathname)) {
    return null;
  }

  return (
    <a
      className="whatsapp-contact"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Vektua XYZ pelo WhatsApp (abre em nova aba)"
    >
      <MessageCircle aria-hidden="true" size={22} strokeWidth={2} />
      <span>WhatsApp</span>
    </a>
  );
}
