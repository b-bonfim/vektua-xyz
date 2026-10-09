'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/whatsapp';

export function WhatsAppContact() {
  const pathname = usePathname();

  // Client-led campaign microsurface: don't overlay a Vektua commerce CTA on Orion artwork.
  if (pathname === '/congrats/orion-tattoo' || pathname === '/congrats/orion-tattoo/') {
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
