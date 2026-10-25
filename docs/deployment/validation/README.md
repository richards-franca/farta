# Validação da migração para a VPS

Verificação consolidada em 25/10/2026. Produção: https://farta.site.

## Evidências

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
