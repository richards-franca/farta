# ADR-003 — API própria e aplicação na VPS

Data: 2026-10-24. Decisão autorizada pelo usuário nesta sessão.

## Decisão

Extrair os casos de uso do Next.js para uma API Fastify/TypeScript. Hospedar API,
Next.js e Caddy em containers separados. PostgreSQL, Auth e Storage permanecem no
Supabase Cloud durante a validação da V1. O usuário aceita reativar manualmente o
projeto gratuito se necessário.

A parte da ADR-001 que adiava uma API separada fica superada por esta decisão.
As regras de isolamento, transação, convites e preços permanecem vigentes.

## Fronteiras

- Navegador chama o Next.js. Server Actions e rotas da aplicação chamam a API pela
  rede privada Docker. A API não publica porta no host.
- Next.js gerencia cookies e os fluxos de autenticação Supabase. Encaminha apenas
  o token de acesso, nunca o refresh token, à API.
- API verifica a identidade com Auth, resolve perfil e membership, valida a entrada
  e executa casos de uso. O estabelecimento selecionado é uma preferência não confiável.
- Cada requisição recebe um cliente Supabase com a própria identidade. Não há
  singleton de sessão nem uso genérico de service role.
- RLS continua obrigatória: as APIs públicas do Supabase permanecem alcançáveis.
  A nova camada não torna seu acesso exclusivo nem substitui as policies.
- Funções SQL críticas permanecem transacionais. Não transferir transações para
  múltiplas requisições independentes.
- Arquivos permanecem em buckets privados; a API valida metadados e assinatura
  do arquivo, e entrega URLs temporárias quando autorizado.

## Contratos e implementação

O pacote `@farta/contracts` contém DTOs, assinaturas, rotas e schemas explícitos.
Operações de negócio têm endpoints POST específicos sob `/v1`, permitindo preservar
os contratos atuais das telas. Não existe endpoint que aceite SQL ou nome arbitrário
de RPC. Exportações usam GET e a mesma autorização do pedido.

Falhas de negócio mantêm o resultado `ok: false` já usado pelas telas. Erros de
transporte e autorização usam HTTP 400/401/403/413/429/503. Escritas não são
repetidas automaticamente após falha de rede ou timeout.

`services/api/src/modules` contém os casos de uso extraídos. `src/modules` contém
adaptadores do Next.js. Novas regras entram na API, com contratos e testes; UI não
importa código de infraestrutura da API. O schema gerado do banco está compartilhado.

## Consequências

Mais uma chamada HTTP por operação e mais um processo para operar. Em troca, os
casos de uso ficam disponíveis para futuras integrações sem depender do runtime
do Next.js. A API pode ser movida para outro servidor sem mudar os contratos da UI.

ERP, filas, rastreamento e Supabase próprio precisam de decisões futuras. Esta
mudança não comprova capacidade da VPS nem segurança em produção sem validação.
