import { redirect } from "next/navigation";
import { currentAdminAuthorized } from "@/lib/admin/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Área administrativa | Vektua XYZ", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await currentAdminAuthorized())) redirect("/admin/login");
  return (
    <main style={{minHeight:"100vh",padding:"clamp(24px,6vw,80px)",background:"#F7F5F0",color:"#24302F",fontFamily:"Manrope,Arial,sans-serif"}}>
      <p style={{color:"#176D67",letterSpacing:"0.1em",textTransform:"uppercase",fontSize:12}}>Vektua XYZ · acesso restrito</p>
      <h1 style={{fontSize:"clamp(2rem,5vw,3.25rem)",fontWeight:500}}>Área administrativa</h1>
      <p>Autenticação preparada. As funções de edição permanecem indisponíveis até os gates próprios.</p>
      <form method="post" action="/admin/logout">
        <button style={{background:"#176D67",color:"white",border:0,borderRadius:4,padding:"13px 21px",cursor:"pointer",minHeight:50}}>Sair do painel</button>
      </form>
    </main>
  );
}
