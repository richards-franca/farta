# Validação da migração para a VPS

Verificação consolidada em 25/10/2026. Produção: https://farta.site.

## Correção de redirecionamento — 27/10/2026

Relato do usuário confirmado por HTTP: `/auth/after-login` e `/auth/callback`
retornavam Location com `https://0.0.0.0:3000`. Os handlers usavam `request.url`,
cuja origem era interna no Next.js standalone. Agora usam a URL pública configurada,
incluindo callback, pós-login, convites e encaminhamento OAuth na raiz.

O ensaio de 25/10 conferia apenas o pathname do retorno, sem validar o domínio;
seu sucesso não comprovava navegação correta no navegador. Essa lacuna foi corrigida:
o ensaio autenticado exige Location completo, e o release verifica cinco retornos
públicos de autenticação, além de HTTPS e assets. O teste novo reproduziu a falha
na versão anterior antes da publicação da correção.

Correção implantada: `d129cb5`, workflow `40542691643` concluído com sucesso.
Os cinco retornos públicos e os assets passaram após deploy. O relatório
`auth-redirect-2026-10-27.json` registra uma requisição autenticada com conta
pendente, Location completo em `https://farta.site/acesso-negado`, zero falhas e
remoção da conta temporária. Duração zero significa conferência funcional única,
não ensaio de carga. Login Google interativo e pedido real continuam fora desse teste.

## Evidências

- Revisão do cliente e login publicada em `30435d7`, release
  [40578267127](https://github.com/richards-franca/farta/actions/runs/40578267127)
  concluído com sucesso. SHA conferido na VPS, HTTPS e retornos públicos aprovados.
  `customer-ui-2026-10-27.json` registra sete páginas em cinco larguras, lifecycle
  de banners e pedido até confirmação, com Auth/API/PostgreSQL reais isolados.
  O login por senha usa endpoint estável e foi exercitado pela interface; origem
  estrangeira e campos ausentes foram recusados. Isso não comprova a sessão da
  conta real do usuário em produção.
- `banner-publication-2026-10-27.json`: banner da referência aprovado pelo usuário,
  publicado ACTIVE, imagem privada acessível por assinatura e auditoria confirmadas.
  Detalhes em `docs/design/customer-banner-review-2026-10-27.md`.
- `restore-check-2026-10-27.json`: novo backup após a publicação, com dois buckets
  e dois objetos do Storage. Banco restaurado isoladamente; contagens de sete
  tabelas, incluindo banners, coincidiram. Arquivos criptografados do Storage
  autenticados e tamanhos conferidos; container temporário removido. Nenhum
  dado descriptografado foi persistido no repositório. Não ensaia a execução
  completa dos serviços Auth/Storage de um Supabase próprio.

- `npm run check`: lint, tipos e builds de web/API, onze casos da API e seis casos
  de segurança das ferramentas de manutenção aprovados.
- O workflow de release executa um Supabase descartável com as migrations e testa
  Auth real, preços, carrinho, pedido, confirmação repetida, PDF/Excel e isolamento
  entre empresas. Não utiliza dados de clientes nesses testes.
- `vps-smoke-2026-10-25.json`: dez acessos concorrentes durante quinze minutos,
  1.711 requisições, zero falhas, p95 de 509 ms. A conta temporária foi removida.
  Esse ensaio cobre sessão/identidade pela aplicação e API; não simula uma carga
  comercial completa com pedidos ou exportações simultâneas em produção.
- `restore-check-2026-10-25.json`: dados do backup criptografado restaurados em um
  Postgres temporário sem porta pública. Contagens de usuários, empresas, perfis,
  pedidos, itens e metadados do Storage coincidiram com o snapshot. Os arquivos
  do Storage também foram autenticados e conferidos. O container foi removido.
- HTTPS, redirecionamentos de domínio e arquivos JS/CSS verificados com
  `node scripts/check-public.mjs`.

## Recuperação e limites

O ensaio de restauração exigiu os schemas gerenciados de Auth/Storage, as roles e
as extensões do ambiente, incluindo `btree_gist`. O backup inclui esses schemas e metadados em arquivos criptografados separados. O schema do dump filtrado pelo
CLI não substitui o bootstrap de um Supabase compatível. Na VPS sem IPv6 de saída,
as ferramentas de backup usam o pooler de sessão IPv4 na porta 5432.

O primeiro ensaio prolongado de 24/10 foi interrompido antes da consolidação e
registrou falhas sem classificação completa. Não há conclusão comprovada sobre a
causa dessas ocorrências. A repetição completa de 25/10 está registrada no JSON.
Os containers não apresentaram OOM ou reinício espontâneo na inspeção.

Login Google com consentimento real, recebimento de e-mails e um fluxo comercial
pela interface com conta real continuam como validação de piloto. A medição acima
não garante capacidade para futuros ERP, integrações ou rastreamento.
