"use client";

import { ProductImage } from '@/components/ui/ProductImage';
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { CartItemControls } from "@/components/cart/CartItemControls";
import { CategoryIcon, CommerceIcon } from "@/components/ui/CommerceIcon";
import { BannerCarousel } from "./banner-carousel";
import { CatalogSkeleton } from './catalog-skeleton';
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCustomerContext, selectCustomerEstablishment } from "@/modules/customer/customer.actions";
import { listActiveBanners, type Banner } from "@/modules/banners/banner.actions";
import { addCatalogItem, getActiveCart, listCatalog, setCartItemQuantity, type ActiveCart, type CatalogListItem } from "@/modules/orders/order.actions";
import styles from "./catalogo.module.css";

const money = (value: number | null) => value == null ? "Preço não definido" : (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function Catalogo() {
  const [products, setProducts] = useState<CatalogListItem[]>([]);
  const [bannerError, setBannerError] = useState("");
  const [banners, setBanners] = useState<Array<Banner & { imageUrl: string | null }>>([]);
  const [cart, setCart] = useState<ActiveCart | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sortAscending, setSortAscending] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [establishments, setEstablishments] = useState<{ id: string; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [busySkus, setBusySkus] = useState<string[]>([]);
  const [itemError, setItemError] = useState<{ skuId: string; quantity: number; message: string } | null>(null);
  const [undo, setUndo] = useState<{ skuId: string; name: string; quantity: number } | null>(null);
  const busyRef = useRef(new Set<string>());
  const [catalogQuantities, setCatalogQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    Promise.all([getCustomerContext(), listCatalog(), getActiveCart(), listActiveBanners()]).then(([context, catalog, currentCart, activeBanners]) => {
      if (!active) return;
      setQuery(new URLSearchParams(window.location.search).get('busca')??'');
      if (context.ok) { setEstablishments(context.establishments); setSelectedId(context.selected?.id ?? ""); } else setNotice(context.message);
      if (catalog.ok) setProducts(catalog.products); else setNotice(catalog.message);
      if (currentCart.ok) setCart(currentCart.cart); else setNotice(currentCart.message);
      if (activeBanners.ok) setBanners(activeBanners.banners); else setBannerError(activeBanners.message);
      setLoading(false);
    }).catch(() => { if (active) { setNotice("Não foi possível carregar o catálogo. Tente novamente."); setLoading(false); } });
    return () => { active = false; };
  }, []);

  useEffect(()=>{
    const refresh=()=>{void listActiveBanners().then(result=>{if(result.ok){setBanners(result.banners);setBannerError('');}else setBannerError(result.message);}).catch(()=>setBannerError('Não foi possível atualizar os destaques.'));};
    const visible=()=>{if(document.visibilityState==='visible')refresh();};
    const timer=window.setInterval(refresh,45*60*1000);
    document.addEventListener('visibilitychange',visible);
    return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
  },[]);

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(products.map(product => product.category)))], [products]);
  const visible = useMemo(() => products.filter(product => category === "Todos" || product.category === category).filter(product => `${product.name} ${product.brand} ${product.detail}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => { if (a.priceMinor == null && b.priceMinor == null) return 0; if (a.priceMinor == null) return 1; if (b.priceMinor == null) return -1; return sortAscending ? a.priceMinor - b.priceMinor : b.priceMinor - a.priceMinor; }), [category, products, query, sortAscending]);

  useEffect(() => { window.dispatchEvent(new CustomEvent("farta:cart-updated", {detail: {count: cart?.items.length ?? 0}})); }, [cart]);

  async function reloadCart() {
    const result = await getActiveCart();
    if (result.ok) setCart(result.cart); else setNotice(result.message);
  }

  const changeEstablishment = useCallback(async (id: string) => {
    if (!id || id === selectedId || busy || busySkus.length > 0) return;
    setCart(null); setItemError(null); setUndo(null); setNotice("Atualizando estabelecimento…"); setBusy(true);
    try { const result = await selectCustomerEstablishment(id); if (result.ok) { setSelectedId(id); await reloadCart(); setNotice("Estabelecimento atualizado."); } else setNotice(result.message); }
    catch { setNotice("Não foi possível atualizar o estabelecimento. Tente novamente."); }
    finally { setBusy(false); }
  }, [busy, busySkus.length, selectedId]);

  useEffect(() => {
    const onSearch = (event: Event) => setQuery((event as CustomEvent<string>).detail ?? "");
    const onEstablishment = (event: Event) => void changeEstablishment((event as CustomEvent<string>).detail ?? "");
    window.addEventListener("farta:catalog-search", onSearch);
    window.addEventListener("farta:catalog-establishment", onEstablishment);
    return () => {
      window.removeEventListener("farta:catalog-search", onSearch);
      window.removeEventListener("farta:catalog-establishment", onEstablishment);
    };
  }, [changeEstablishment]);

  async function add(skuId: string, quantity = 1) {
    if (busy || busyRef.current.has(skuId)) return;
    busyRef.current.add(skuId); setBusySkus([...busyRef.current]); setItemError(null);
    const result = await addCatalogItem(skuId, quantity);
    if (result.ok) { await reloadCart(); setNotice("Produto adicionado ao carrinho compartilhado."); } else setNotice(result.message);
    busyRef.current.delete(skuId); setBusySkus([...busyRef.current]);
  }

  async function changeQuantity(skuId: string, quantity: number) {
    if (!cart || busy || busyRef.current.has(skuId)) return;
    busyRef.current.add(skuId); setBusySkus([...busyRef.current]); setItemError(null); setNotice(""); setUndo(null);
    const removed = quantity === 0 ? cart.items.find(item => item.skuId === skuId) : undefined;
    const result = await setCartItemQuantity({ cartId: cart.id, skuId, quantity });
    if (result.ok) { await reloadCart(); if (removed) setUndo({ skuId, name: removed.name, quantity: removed.quantity }); } else setItemError({ skuId, quantity, message: result.message });
    busyRef.current.delete(skuId); setBusySkus([...busyRef.current]);
  }

  async function undoRemoval() {
    if (!undo || busy || busyRef.current.has(undo.skuId)) return;
    const item = undo; setUndo(null); busyRef.current.add(item.skuId); setBusySkus([...busyRef.current]);
    const result = await addCatalogItem(item.skuId, item.quantity);
    if (result.ok) await reloadCart(); else setNotice(result.message);
    busyRef.current.delete(item.skuId); setBusySkus([...busyRef.current]);
  }

  if(loading)return <CatalogSkeleton/>;
  return <main className={styles.page} aria-busy={busy}><div className={styles.content}>
    <div className={styles.contextBar}><label htmlFor="catalog-establishment">Estabelecimento</label><select id="catalog-establishment" value={selectedId} disabled={busy || loading || busySkus.length > 0} onChange={event => void changeEstablishment(event.target.value)}><option value="">Selecione</option>{establishments.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{busy && <span role="status" aria-live="polite">Atualizando estabelecimento…</span>}</div>
    <section className={styles.discoveryHeader} aria-labelledby="catalog-title">
      <PageHeader title="Olá, vamos abastecer sua operação?" description="Tudo o que seu negócio precisa, em um só pedido." />
    </section>
    {bannerError && <p role="alert">{bannerError}</p>}
    <BannerCarousel banners={banners} />
    <section className={styles.search} aria-label="Busca e filtros"><Input id="catalog-search" label="Buscar produto, marca, categoria ou embalagem" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Busque por produto, marca ou embalagem" className={styles.searchInputControl} /><Button type="button" onClick={() => setNotice(query ? `Resultados para “${query}”.` : "Informe o que deseja buscar.")}>Buscar</Button><Button type="button" variant="secondary" onClick={() => { setQuery(""); setCategory("Todos"); }}>Limpar filtros</Button></section>
    {notice && <div className={styles.notice} role="status" aria-live="polite">{notice}<Button type="button" variant="tertiary" onClick={() => setNotice("")} aria-label="Fechar aviso">×</Button></div>}
    {undo && <div className={styles.undoNotice} role="status">{undo.name} removido do carrinho. <Button type="button" variant="tertiary" onClick={() => void undoRemoval()}>Desfazer</Button></div>}
    <section className={styles.categorySection} aria-labelledby="category-title"><h2 id="category-title">O que você precisa hoje?</h2><div className={styles.chips} role="group" aria-label="Categorias">{categories.map(item => <Button type="button" variant="tertiary" aria-pressed={category === item} className={`${styles.categoryCard} ${category === item ? styles.selected : ""}`} key={item} onClick={() => setCategory(item)}><span className={styles.categoryIcon} aria-hidden="true"><CategoryIcon category={item} /></span><span>{item}</span></Button>)}</div></section>
    <div className={styles.productHeading}><h2>Para sua próxima reposição</h2><div className={styles.filters}><Button type="button" variant="tertiary" className={styles.sort} onClick={() => setSortAscending(current => !current)} aria-pressed={sortAscending}>Ordenar: {sortAscending ? "menor preço" : "recomendados"}⌄</Button></div></div>
    <section className={styles.workspace}><div className={styles.productGrid}>{loading ? <p role="status">Carregando catálogo…</p> : visible.length === 0 ? <p role="status">Nenhum produto encontrado. Tente limpar os filtros.</p> : visible.map(product => {
        const imageUrl = product.imageUrl || "/product-placeholder.svg";
        const label = product.saleUnit === "BOX" ? "caixa" : "unidade";
        const minimum = product.minimumQuantity;
        const quantity = catalogQuantities[product.skuId] ?? minimum;
        return <Card className={styles.product} key={product.skuId}>
          {product.priceMinor == null && <Badge tone="default">Preço não definido</Badge>}
          <div className={styles.productImage}><ProductImage src={imageUrl} alt={product.imageAlt ?? product.name} width={640} height={480} /></div>
          <div className={styles.productCategory}>{product.brand || product.category || "Farta"}</div>
          <h2>{product.name}</h2>
          <small>{product.detail}</small>
          <strong>{money(product.priceMinor)}</strong>
          <p className={styles.minimum}>{product.priceMinor == null ? 'Preço ainda não definido.' : 'Estimado'} / {product.saleUnit} · mínimo {minimum} {label}{minimum === 1 ? '' : 's'}</p>
          <div className={styles.productActions}>
            <label className={styles.quantityField} htmlFor={`catalog-quantity-${product.skuId}`}>
              <span>Quantidade</span>
              <input id={`catalog-quantity-${product.skuId}`} type="number" min={minimum} step={1} value={quantity} disabled={busy || busySkus.includes(product.skuId)} onChange={event => setCatalogQuantities(current => ({ ...current, [product.skuId]: Math.max(minimum, Number(event.target.value) || minimum) }))} />
            </label>
            <Button type="button" variant="secondary" disabled={product.priceMinor == null || busy || busySkus.includes(product.skuId)} onClick={() => void add(product.skuId, quantity)}>{busySkus.includes(product.skuId) ? "Adicionando…" : product.priceMinor == null ? "Sem preço" : "Adicionar"}</Button>
          </div>
        </Card>;
      })}</div>
      <Card className={styles.summary} aria-label="Resumo do pedido">
        <div><h2>Seu pedido</h2><CommerceIcon name="basket" /></div>
        <p>{establishments.find(item => item.id === selectedId)?.name}<br />Carrinho compartilhado com sua equipe</p>
        {!cart?.items.length ? <div className={styles.emptyCart} role="status"><CommerceIcon name="basket" /><strong>Seu próximo pedido começa aqui</strong><p>Adicione produtos e acompanhe sua seleção por aqui.</p></div> : cart.items.map(item => <div className={styles.line} key={item.id}><div className={styles.lineInfo}><div><strong>{item.name}</strong><small>{item.detail} · Mínimo: {item.minimumQuantity}</small></div><span>{money(item.subtotalMinor)}</span></div><CartItemControls name={item.name} quantity={item.quantity} pending={busySkus.includes(item.skuId)} disabled={busy} onChange={quantity => void changeQuantity(item.skuId, quantity)} onRemove={() => void changeQuantity(item.skuId, 0)} />{itemError?.skuId === item.skuId && <p className={styles.itemError} role="alert">{itemError.message} <Button type="button" variant="tertiary" onClick={() => void changeQuantity(item.skuId, itemError.quantity)}>Tentar novamente</Button></p>}</div>)}
        <footer><p>Subtotal estimado</p><strong aria-live="polite">{money(cart?.totalMinor ?? 0)}</strong>{cart?.items.length ? <Link href="/pedido">Ver pedido →</Link> : <span className={styles.disabledCheckout} aria-disabled="true">Ver pedido →</span>}<small>Os preços são estimados. Você revisa os valores finais antes de confirmar.</small></footer>
      </Card>
    </section>
    <div className={styles.trustBar}><span><CommerceIcon name="check" />Revise os preços finais antes de confirmar</span><span><CommerceIcon name="team" />Pedido compartilhado com sua equipe</span><span><CommerceIcon name="support" />Atendimento quando precisar</span></div>
  </div></main>;
}
