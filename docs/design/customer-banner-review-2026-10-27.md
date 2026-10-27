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

Repetição final aprovada em `30435d7`, workflow [40578267127](https://github.com/richards-franca/farta/actions/runs/40578267127), incluindo build e deploy:
`docs/deployment/validation/customer-ui-2026-10-27.json`. Capturas de catálogo,
checkout, perfil, pedidos, detalhe confirmado, notificações, mensagens e admin de
banners foram inspecionadas. A matriz cobre sete páginas em cinco larguras:
catálogo, checkout, pedido confirmado, perfil, pedidos, notificações e mensagens.
Uma falha real em pedidos a 768px foi corrigida: o texto acessível do cabeçalho
escapava do contêiner de rolagem. O contêiner agora estabelece o contexto de
posicionamento; a tabela mantém a rolagem interna sem ampliar a página.
Isso não equivale a certificar toda rota, perfil, viewport ou configuração externa.

## Login entre publicações

O relato de falha genérica de acesso coincidiu com logs de Server Action antiga
não encontrada, enviados por uma aba aberta antes do deploy. O login por senha
agora usa `POST /api/auth/login`, com verificação de origem, JSON limitado a 4 KiB
e a autenticação existente no servidor. O build identifica a versão com
`NEXT_DEPLOYMENT_ID`. O CI verifica origem estrangeira recusada, campos ausentes
e login real pela interface com os cookies de sessão. Uma aba que ainda contém
o código antigo precisa ser recarregada uma vez. Isso não substitui a confirmação
de acesso do usuário real nem garante ausência de mudanças de versão em toda mutação.

## Conteúdo e limites

O usuário aprovou explicitamente o banner da referência em 27/10. Publicado
ativo no Cloud: “Mais frescor. Mais motivos para voltar.”, descrição “Frutas e
verduras para completar sua reposição.”, com a mesma foto de hortifruti do Pencil.
Imagem JPEG de 187.598 bytes no Storage privado, entrega assinada HTTP 200 e
registro de auditoria confirmados em `banner-publication-2026-10-27.json`.
`scripts/publish-reference-banner.mjs` é uma manutenção pontual autorizada:
recusa execução sem flag explícita ou se já existir qualquer banner. Não o repetir
para editar campanhas; usar `/admin/banners`. A credencial de manutenção não foi
incluída no runtime nem versionada. Dados fictícios dos testes não foram publicados.

Consentimento Google real, entrega de e-mails e acompanhamento de carga comercial
no piloto continuam validações separadas. Testes locais com fixtures não comprovam
esses serviços externos nem substituem a conferência de uma sessão real na VPS.
