import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/5535984445677';

export function WhatsAppContact() {
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
