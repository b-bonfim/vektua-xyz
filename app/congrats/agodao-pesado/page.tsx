import { redirect } from 'next/navigation';

/** Compatibility with the originally typed URL on the packaging brief. */
export default function AlgodaoPesadoTypoRedirect() {
  redirect('/congrats/algodao-pesado');
}
