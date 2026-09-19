import { redirect } from 'next/navigation';
// Custom SKU pages use the existing Hi3D concept flow; no customer uploads or payments.
export default function PetOffer() { redirect('/feitos-para-voce/pet'); }
