# Revisão de banners e telas do cliente — 27/10/2026

## Falha encontrada e correção

`admin_list_banners()` devolvia uma coluna composta (`select b`) em vez das
colunas exigidas por `setof public.banners`. A listagem falhava inclusive vazia,
e a página administrativa não mostrava o formulário. A migration aditiva
`20261027000100_fix_banner_listing_row_shape.sql` usa `b.*`, preserva a autorização
de administrador ativo e os grants. O histórico de migrations não foi reescrito.

Backup criptografado de 27/10 concluído antes da aplicação no Cloud. O dry-run
confirmou apenas essa migration. Não houve alteração de tabelas ou conteúdo dos
pedidos. Na inspeção inicial de produção havia zero banners cadastrados.

## Convergência visual

Referência: `untitled.pen` e exports de `Sdnoa`, `G4VM0i`, `L9mHNx`, `QFXql`,
`gsj1I` e perfil `vyXQN`, no documento Pencil registrado na auditoria de exports.

- Inter local com licença OFL; valores monetários usam a tipografia da referência.
- Categorias com ícones, cartões e estado ativo; regras específicas impedem que
  os estilos genéricos de Button/Card sobrescrevam a composição do catálogo.
- Resumo vazio, aviso de preços estimados, indicadores de confiança e atalho do
  carrinho com contagem de produtos distintos, separada dos volumes.
- Imagens vêm do cadastro, sem inferência pelo nome do produto. Ausência ou falha
  de imagem tem placeholder neutro. Não foram alterados cadastros de produtos.
- Checkout com miniaturas, preço estimado por item, contexto de estabelecimento
  junto ao aviso do carrinho, totais, continuação das compras e passos da revisão.
- Perfil com composição centralizada, dados reais, contato manual e seção de sessão.
- Skeleton do catálogo acompanha a composição; carrossel tem pausa explícita,
  teclado, toque, reduced motion e fallback de imagem. URLs dos destaques são
  renovadas na retomada da aba e periodicamente enquanto o catálogo está aberto.

Os dados e a quantidade de produtos continuam reais. Não copiar nomes, preços,
empresa ou usuário dos desenhos. Links/CTA de banner, campanhas agendadas e
segmentação continuam fora do contrato BANNERS-001; não desenhar ações fictícias.

## Validação reproduzível

`scripts/ui-qa.mjs` roda somente contra Supabase local descartável e recusa Cloud.
O workflow de release constrói o web e inicia API/Next reais para testar em Chromium:

1. Login de administrador; upload válido no Storage privado; criação inativa.
2. Login de cliente; banner inativo ausente; ativação e imagem visível; rotação
   manual e pausa; desativação e remoção do destaque da consulta do cliente.
3. Catálogo, adição ao carrinho, contador de distintos, checkout com endereço e
   observação, envio para análise, precificação pela API e confirmação pela UI.
4. Perfil, pedidos, notificações, mensagens e bloqueio do admin para cliente.
5. Capturas em 320/390/768/1024/1440px, sem overflow horizontal global; fonte local
   carregada. Erros de execução no navegador fazem o teste falhar.

Capturas e relatório são publicados no artifact `customer-ui-qa` do GitHub Actions.
A rodada `40568972895` aprovou o fluxo completo em `91148d9`; seu restante foi
cancelado para publicar a revisão visual final. Novas revisões precisam repetir
essa bateria antes do deploy. A comparação humana usa a geometria das referências;
não é uma comparação automática de pixels com conteúdo fictício.

Repetição final aprovada em `ff3eec1`, integração do workflow `40569981034`:
`docs/deployment/validation/customer-ui-2026-10-27.json`. Capturas de catálogo,
checkout, perfil, pedidos, detalhe confirmado, notificações, mensagens e admin de
banners foram inspecionadas. A matriz de cinco larguras mede o catálogo; as demais
páginas foram verificadas na jornada desktop. Isso não equivale a certificar toda
rota, perfil, viewport ou configuração externa.

## Conteúdo e limites

Não inserir automaticamente campanhas fictícias no banco. O primeiro banner
depende da arte/conteúdo escolhido pelo usuário e pode ser cadastrado em
`/admin/banners`, revisado como inativo e ativado depois. Um catálogo sem banners
ativos não exibe o carrossel e continua utilizável.

Consentimento Google real, entrega de e-mails e acompanhamento de carga comercial
no piloto continuam validações separadas. Testes locais com fixtures não comprovam
esses serviços externos nem substituem a conferência de uma sessão real na VPS.
