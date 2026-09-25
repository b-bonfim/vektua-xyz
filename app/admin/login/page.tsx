import { redirect } from "next/navigation";
import { currentAdminAuthorized } from "@/lib/admin/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Acesso administrativo | Vektua XYZ", robots: { index: false, follow: false } };

export default async function AdminLogin({searchParams}: {searchParams: Promise<{erro?: string}>}) {
  if (await currentAdminAuthorized()) redirect("/admin");
  const hasError = (await searchParams).erro === "acesso";
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"#F7F5F0",color:"#24302F",fontFamily:"Manrope,Arial,sans-serif"}}>
      <section style={{width:"min(100%,440px)",padding:"clamp(24px,5vw,40px)",border:"1px solid #D8DBD4",background:"#fff"}} aria-labelledby="admin-login-title">
        <p style={{color:"#176D67",fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase"}}>Vektua XYZ · acesso restrito</p>
        <h1 id="admin-login-title" style={{fontSize:"clamp(1.8rem,4vw,2.5rem)",fontWeight:500,margin:"0 0 12px"}}>Entrar no painel</h1>
        <p style={{lineHeight:1.6}}>Somente operadores autorizados. O catálogo público não precisa de login.</p>
        {hasError && <p role="alert" style={{color:"#AD3927"}}>Não foi possível autenticar ou autorizar o acesso. Confira os dados ou contate o responsável.</p>}
        <form method="post" action="/admin/session" style={{display:"grid",gap:16}}>
          <label htmlFor="admin-email">E-mail
            <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} style={{display:"block",width:"100%",marginTop:5,padding:12,border:"1px solid #D8DBD4",borderRadius:4}} />
          </label>
          <label htmlFor="admin-password">Senha
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required minLength={1} style={{display:"block",width:"100%",marginTop:5,padding:12,border:"1px solid #D8DBD4",borderRadius:4}} />
          </label>
          <button type="submit" style={{background:"#176D67",color:"white",padding:"14px 21px",border:0,borderRadius:4,cursor:"pointer",minHeight:50}}>Entrar</button>
        </form>
        <p style={{fontSize:13,marginTop:24}}>Não possui acesso? Solicite habilitação ao responsável. Não há cadastro público.</p>
        <a href="/" style={{color:"#176D67"}}>Voltar à loja</a>
      </section>
    </main>
  );
}
