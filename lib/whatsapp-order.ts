import type { CartItem } from '@/components/cart-context';
import type { CatalogProduct } from './catalog-repository';
import { commercialProducts } from './commercial-catalog';

const PHONE = '5535984445677';
const clean = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 300);
type OrderProduct = Pick<CatalogProduct, 'id' | 'name'>;

/**
 * Creates an editable WhatsApp draft.
 * Neither opening the link nor sending a message creates a persisted/confirmed order.
 *
 * The product snapshot is injectable so the same cart can be resolved against the
 * static catalog during rollback or against the Supabase-backed catalog after cutover.
 */
export function buildWhatsAppOrderUrl(
  items: CartItem[],
  notes = '',
  products: readonly OrderProduct[] = commercialProducts,
): string | null {
  const lines = items.flatMap(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return [];
    return [`• ${product.name} (${product.id}) — ${item.quantity} un. — opção: ${clean(item.color) || 'A combinar'}`];
  });
  if (!lines.length) return null;
  const message = [
    'Olá, Vektua XYZ! Vim pelo site e gostaria de solicitar este pedido:',
    '', ...lines, '',
    ...(clean(notes) ? [`Observações: ${clean(notes)}`, ''] : []),
    'Por favor, confirmem disponibilidade, opções, preço final, frete e prazo antes de fechar o pedido.',
    'Entendo que esta mensagem não confirma compra, reserva ou pagamento.',
  ].join('\n');
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
