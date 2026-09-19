import { redirect } from 'next/navigation';
// The existing shared PDP hard-codes the pet flow for all custom products.
// Preserve that component; route this offer to its correct private demo flow.
export default function PersonOffer() { redirect('/feitos-para-voce/pessoa'); }
