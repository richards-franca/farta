"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SignOutButton } from "./SignOutButton";
import { getCustomerContext } from "@/modules/customer/customer.actions";
import { getShellIdentity } from '@/modules/auth/shell.actions';
import { getActiveCart } from '@/modules/orders/order.actions';
import type { NavProfile } from './nav-config';
import { CommerceIcon } from '@/components/ui/CommerceIcon';
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router=useRouter();
  const shouldRenderShell = pathname ? !pathname.startsWith("/auth") && !pathname.startsWith("/acesso-negado") : false;
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const profileRoute=pathname==='/perfil';
  const [identity,setIdentity]=useState<{name:string;role:NavProfile}|null>(null);
  const [cartCount,setCartCount]=useState(0);
  const customerShell = shouldRenderShell && (identity ? identity.role==='CUSTOMER' : !isAdmin && !pathname?.startsWith("/operacao"));
  useEffect(()=>{
    if(!shouldRenderShell)return;
    let active=true;
    void getShellIdentity().then(value=>{if(active)setIdentity(value);}).catch(()=>{});
    return ()=>{active=false;};
  },[shouldRenderShell,pathname]);
  useEffect(()=>{
    if(!customerShell)return;
    let active=true;
    void getActiveCart().then(result=>{if(active&&result.ok)setCartCount(result.cart?.items.length??0);}).catch(()=>{});
    const update=(event:Event)=>setCartCount((event as CustomEvent<{count:number}>).detail.count);
    window.addEventListener('farta:cart-updated',update);
    return ()=>{active=false;window.removeEventListener('farta:cart-updated',update);};
  },[customerShell,pathname]);
  const [customerEstablishment, setCustomerEstablishment] = useState("Estabelecimento ativo");
  const [customerEstablishments, setCustomerEstablishments] = useState<{ id: string; name: string }[]>([]);
  const [customerEstablishmentId, setCustomerEstablishmentId] = useState("");
  useEffect(() => {
    if (!customerShell) return;
    let active = true;
    void getCustomerContext().then((result) => {
      if (active && result.ok) {
        setCustomerEstablishments(result.establishments);
        setCustomerEstablishmentId(result.selected?.id ?? "");
        if (result.selected?.name) setCustomerEstablishment(result.selected.name);
      }
    });
    return () => { active = false; };
  }, [customerShell, pathname]);
  if (!shouldRenderShell) return <>{children}</>;

  const navProfile = identity?.role ?? (isAdmin
    ? "PLATFORM_ADMIN" as const
    : pathname?.startsWith("/operacao/entregas")
      ? "DRIVER" as const
      : pathname?.startsWith("/operacao")
        ? "INTERNAL_OPERATOR" as const
        : undefined);
  const showCustomerNotifications = customerShell;
  const catalogRoute = customerShell && pathname === "/catalogo";
  const shoppingRoute=customerShell&&(catalogRoute||pathname==='/pedido');
  const adminWorkspaceLabel = pathname === "/admin/empresas" || pathname?.startsWith("/admin/empresas/")
    ? "Administração / Empresas"
    : pathname?.startsWith("/admin/produtos") || pathname?.startsWith("/admin/categorias")
      ? "Administração / Produtos"
      : pathname?.startsWith("/admin/pedidos")
        ? "Administração / Pedidos"
        : "Administração";
  const selectCatalogEstablishment = (value: string) => {
    setCustomerEstablishmentId(value);
    const selected = customerEstablishments.find(item => item.id === value);
    if (selected) setCustomerEstablishment(selected.name);
    window.dispatchEvent(new CustomEvent("farta:catalog-establishment", { detail: value }));
  };
  const updateCatalogSearch = (value: string) => {
    window.dispatchEvent(new CustomEvent("farta:catalog-search", { detail: value }));
  };
  const workspaceLabel = isAdmin ? "Administração" : pathname?.startsWith("/operacao") ? "Operação" : "Área de trabalho";

  return <div className={`${styles.shell} ${customerShell ? styles.customerShell : ""} ${profileRoute?styles.profileShell:''}`}>
    <a className={styles.skipLink} href="#main-content">Pular para o conteúdo</a>
    <aside className={styles.sidebar}>
      <Link className={styles.sidebarBrand} href="/" aria-label="Farta, início"><Image src="/farta-logo-light.png" alt="" width={188} height={188} priority /></Link>
      <PrimaryNav profile={navProfile} />
      <div className={styles.sidebarAccount}><CommerceIcon name="team" /><div><strong>{identity?.name || 'Minha conta'}</strong><small>{identity?.role==='CUSTOMER'?'Cliente':identity?.role==='PLATFORM_ADMIN'?'Administrador':'Equipe Farta'}</small></div></div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.header}>
        <Link className={styles.mobileBrand} href="/" aria-label="Farta, início"><Image src="/farta-logo.png" alt="" width={48} height={48} priority /><span>Farta</span></Link>
        {profileRoute?<Link className={styles.workspaceLabel} href={identity?.role==='PLATFORM_ADMIN'?'/admin/empresas':identity?.role==='INTERNAL_OPERATOR'?'/operacao/pedidos':identity?.role==='DRIVER'?'/operacao/entregas':'/catalogo'}>Área de trabalho</Link>:catalogRoute ? <div className={styles.customerWorkspaceLabel}>
          <small>Comprando para</small>
          {customerEstablishments.length > 0 ? <select aria-label="Estabelecimento da compra" value={customerEstablishmentId} onChange={event => selectCatalogEstablishment(event.target.value)}>
            {customerEstablishments.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select> : <strong>{customerEstablishment}</strong>}
        </div> : customerShell ? <div className={styles.customerWorkspaceLabel}><small>Comprando para</small><strong>{customerEstablishment}</strong></div> : <span className={styles.workspaceLabel}>{isAdmin ? adminWorkspaceLabel : workspaceLabel}</span>}
        {shoppingRoute && <label className={styles.customerSearch}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg><input type="search" aria-label="Buscar produto, marca ou embalagem" placeholder="Busque por produto, marca ou embalagem" onChange={event => {if(catalogRoute)updateCatalogSearch(event.target.value);}} onKeyDown={event=>{if(event.key==='Enter'&&!catalogRoute)router.push('/catalogo?busca='+encodeURIComponent(event.currentTarget.value));}} /></label>}
        <div className={styles.actions}>{customerShell&&!profileRoute&&<Link className={styles.cartLink} href="/pedido" aria-label={`Ver pedido, ${cartCount} produtos distintos`}><CommerceIcon name="basket" /><b>{cartCount}</b></Link>}{showCustomerNotifications && <Link className={styles.notificationLink} href="/notificacoes" aria-label="Abrir notificações"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg><span>Notificações</span></Link>}<Link className={styles.profileLink} href="/perfil" aria-label="Abrir meu perfil"><b>{identity?.name?.slice(0,1).toUpperCase()||'•'}</b><span>Meu perfil</span></Link><SignOutButton className={styles.signOutButton} /></div>
      </header>
      <div id="main-content" tabIndex={-1} className={styles.content}>{children}</div>
    </div>
  </div>;
}
