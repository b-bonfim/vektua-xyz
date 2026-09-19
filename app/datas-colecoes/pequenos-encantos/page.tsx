import { redirect } from 'next/navigation';
// The fictional collection name from the first demo is not an approved product/collection.
export default function RetiredDemoCollection() { redirect('/datas-colecoes'); }
