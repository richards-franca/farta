'use client';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}) {
  return <main style={{maxWidth:560,margin:'10vh auto',padding:24}}>
    <h1>Não foi possível carregar esta página</h1>
    <p>O serviço pode estar temporariamente indisponível. Aguarde um instante e tente novamente.</p>
    <button type="button" onClick={reset}>Tentar novamente</button>
  </main>;
}
