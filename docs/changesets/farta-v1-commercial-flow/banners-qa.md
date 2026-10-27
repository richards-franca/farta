# BANNERS-001 — implementação e QA

## Atualização — 27/10/2026

A validação histórica abaixo não executou a listagem real pela interface. Foi
encontrado um retorno SQL incompatível em `admin_list_banners()`, corrigido por
migration aditiva. Upload, ativação, exibição para cliente, pausa/rotação e
desativação agora passaram em Chromium com Supabase descartável real.
Resultado atual: `docs/design/customer-banner-review-2026-10-27.md` e
`docs/deployment/validation/customer-ui-2026-10-27.json`. O restante deste arquivo
preserva os gates e limites da implementação original.

**Status:** implementação mínima concluída.

## Entregas

- Tabela global `banners` com `ACTIVE`/`INACTIVE` e ordenação determinística.
- Bucket privado `catalog-banners`, limitado a JPEG/PNG/WebP de até 5 MB.
- RPCs administrativas protegidas por `PLATFORM_ADMIN` ativo.
- Rota `/admin/banners` para cadastro, edição, ordem e ativação.
- Carrossel no catálogo com fallback sem imagem, controles manuais, teclado e autoplay de 8 segundos.
- Banners inativos não são retornados para clientes.
- Sem agendamento, segmentação, links ou métricas.

## Gates executados

- Migration `20261001001600_banners.sql` aplicada no Supabase remoto.
- `supabase db lint --linked`: `No schema errors found`.
- `npm.cmd run typecheck`: aprovado.
- `npm.cmd run lint`: aprovado sem warnings.
- `npm.cmd run build`: aprovado; rota `/admin/banners` gerada.

## Limitação

O smoke visual autenticado como `PLATFORM_ADMIN` depende do portal Admin QA, que permanece indisponível nesta sessão. A rota continua protegida por `requirePlatformAdmin()` e pelas RPCs server-side.
