# Preparação da integração Mercado Pago — 27/10/2026

Estado: planejamento solicitado pelo usuário; nenhuma integração, cobrança ou
migration de pagamento aplicada. Decisão confirmada: oferecer checkout depois
de o cliente aceitar o valor final do pedido. Demais escolhas abaixo são propostas
ou pendências, não regras comerciais aprovadas.

## Estado atual verificado

- Backend Fastify privado na VPS; Next.js/Caddy públicos; PostgreSQL/Auth/Storage
  no Supabase Cloud. Preservar essa divisão.
- `confirm_final_order_price` confirma o valor, reserva estoque, cria entrega e
  muda o pedido para `CUSTOMER_CONFIRMED`.
- `company_start_order_picking`, `admin_start_order_picking` e
  `advance_order_status` permitem iniciar separação após confirmação do cliente.
  A futura condição financeira precisa estar nos caminhos SQL e API, não apenas UI.
- Não há módulo transacional de pagamentos nas migrations inspecionadas.
  Empresas têm `payment_terms_days` e `credit_limit_minor`: são condições
  comerciais, não evidência de cobrança, recebimento ou implementação de crédito.

Fontes locais: `20261001000200_order_review_flow.sql`,
`20261001000300_order_review_picking_guards.sql`,
`20261001000900_confirm_order_replay_after_picking.sql` e módulo orders da API.

## Informações a reunir antes da implementação

| Item | Informação necessária |
| --- | --- |
| Recebedor | Conta única da Farta ou contas de fornecedores? Há comissão/divisão de valores? |
| Conta | Titular e cadastro validados no Mercado Pago, acesso ao painel Developers e aplicação criada para o site. Conferir habilitação de produção no painel. |
| Ambientes | Credenciais de teste/produção e identificação da aplicação/conta. Segredo de assinatura dos webhooks separado por configuração/ambiente. |
| Experiência | Checkout hospedado no Mercado Pago ou pagamento dentro do site? Proposta inicial: Checkout Pro com redirecionamento. |
| Meios | Pix, crédito, débito ou boleto; disponibilidade validada na conta/produto contratado. Proposta inicial: Pix e cartão, sem boleto até definir prazo de reserva. |
| Parcelamento | Número máximo, juros, quem absorve custos e taxas, política de recebimento escolhida. Conferir condições da conta; não fixar taxas pelo plano. |
| Cobrança | Pagamento integral antecipado? Frete já está no total final? Existe desconto, sinal, pagamento na entrega ou faturamento a prazo? |
| Prazo | Validade do valor aceito, do checkout e da reserva de estoque; comportamento após expiração. |
| Exceções | Cancelamento antes/depois de pagar, reembolso parcial/integral, falta de produto, cobrança duplicada, pagamento tardio e contestação. |
| Operação | Quem consulta, reembolsa e resolve divergências? Canal de suporte, política de cancelamento e dados de identificação a mostrar ao comprador. |

Não enviar Access Token, Client Secret, assinatura de webhook ou dados de cartão
em chat, GitHub ou vault. Configurar segredos diretamente no ambiente protegido;
somente credenciais estritamente públicas podem chegar ao frontend quando exigidas.

Conta única e marketplace são alternativas arquiteturais diferentes. Caso cada
fornecedor receba, projetar vinculação/autorização de contas, armazenamento seguro
e renovação de credenciais, isolamento dos recebedores, comissão e responsabilidades
por estorno. Não implementar split implicitamente.

## Fluxo proposto

1. Cliente aceita a revisão de preços. Uma transação registra valor aceito imutável,
   versão, moeda, política de pagamento e reserva. Não manter transação SQL aberta
   durante chamadas ao Mercado Pago.
2. Backend autoriza empresa/pedido e cria ou reutiliza checkout válido para essa
   obrigação. Valores vêm do banco; o browser não determina o valor cobrado.
3. Criação externa tem chave idempotente persistida ANTES da chamada. Repetições
   por timeout usam a MESMA chave; uma nova tentativa intencional recebe nova chave.
   Falhas externas deixam estado recuperável, sem exigir nova confirmação comercial.
4. Cliente vai ao checkout e volta à página do pedido. Fechar a aba ou perder a
   conexão não interrompe o acompanhamento do pagamento pelo servidor.
5. Webhook assinado é validado, persistido com deduplicação e reconhecido rapidamente.
   Processamento consulta a API do Mercado Pago e verifica recebedor, ambiente,
   referência, moeda, valor e vínculo com o pedido antes de aplicar transição.
6. Atualização transacional registra pagamento/histórico e libera a operação apenas
   uma vez, conforme política aprovada. A URL de retorno nunca comprova pagamento.
7. Rotina periódica reconcilia pendências, recupera eventos que falharam e sinaliza
   divergências. Expiração/cancelamento externo, estoque e pagamentos tardios devem
   ser coordenados; um link antigo não pode liberar um pedido cancelado.

Proposta V1: uma obrigação integral por pedido, sem sinal ou pagamento dividido;
separação após pagamento aprovado, com prazo de reserva a definir. Pedidos antigos
precisam de classificação explícita, preservando a operação anterior; nunca
preencher histórico de pagamento como aprovado sem evidência.

Separar estados comerciais/operacionais dos financeiros. Exemplo: um pedido pode
estar `CUSTOMER_CONFIRMED` e financeiramente `PENDING`. O estado de pagamento não
deve transformar o pedido automaticamente em entregue, cancelado ou separado.

## Modelo de dados proposto

Nomes e campos são proposta de desenho, ainda sem migration executável.

| Tabela | Responsabilidade e campos principais |
| --- | --- |
| `order_payment_intents` | Obrigação do pedido: UUID, `order_id`, `company_id`, revisão de preço aceita, `amount_minor`, `currency`, política, estado financeiro agregado, validade, criador e datas. Snapshot imutável da cobrança aprovada. |
| `payment_checkouts` | Sessões/tentativas de abrir cobrança: obrigação, provedor, ambiente, conta recebedora, chave idempotente, referência externa, ID da order/preferência no provedor, URL protegida, validade, estado de criação, datas e erro sanitizado. |
| `payments` | Transações efetivas: checkout/obrigação, ID externo único, estado/detalhe original e normalizado, meio, parcelas, valor bruto aprovado, taxa e líquido quando disponibilizados, valor reembolsado, data de aprovação, previsão/data de disponibilidade e última sincronização. |
| `payment_events` | Caixa de entrada de webhooks: chave de deduplicação conforme contrato do provedor, tipo, recurso externo, ambiente/recebedor, recebimento, processamento, tentativas, próximo retry, erro sanitizado e conteúdo mínimo necessário. Acesso somente interno. |
| `payment_refunds` | Reembolsos parciais/integrais: pagamento, valor, motivo, solicitante, chave idempotente, ID externo, estado, datas e erro sanitizado. Solicitação e conclusão são fatos distintos. |

Usar `audit_logs` existente para ações administrativas e transições financeiras
com origem e identificadores sanitizados. Se o formato atual não atender ao
histórico financeiro, adicionar histórico específico na implementação.

Relações: pedido → obrigação → vários checkouts → vários pagamentos; cada pagamento
pode ter vários reembolsos. Uma tentativa de checkout não significa recebimento.
Separar ID da order do Mercado Pago, ID do pagamento e ID do pedido Farta.

Regras de integridade:

- Valores em centavos inteiros (`bigint`), moeda explícita, sem ponto flutuante.
  Converter para o formato exigido pelo provedor apenas na borda da integração.
- FKs e vínculos coerentes entre pedido, obrigação, checkout, pagamento e empresa.
  Impedir alteração do vínculo de uma transação já registrada.
- Identificadores únicos do provedor escopados por provedor/ambiente/recebedor;
  deduplicar eventos conforme o identificador/contrato da API escolhida.
- Bloqueio transacional ao iniciar checkout e ao liquidar a obrigação. Reusar
  sessão válida; reembolsos concorrentes não excedem o saldo reembolsável.
- Não omitir um segundo pagamento real com uma constraint de "um aprovado por
  pedido". Registrar a duplicidade, impedir dupla liberação e gerar ocorrência
  para tratamento/reembolso conforme política.
- Não voltar de aprovado para pendente devido a evento atrasado; consultar o
  estado atual. Reembolso/contestação posterior é transição válida e auditada.
- Diferenciar aprovado, disponível em saldo e efetivamente transferido à conta.
  Taxa/líquido indisponíveis ficam nulos, nunca zero presumido.
- Não armazenar PAN completo, CVV, tokens secretos nem payloads integrais
  indiscriminados. Minimizar dados de pagador, definir retenção e restringir leitura.

Estados internos propostos: obrigação pendente/paga/parcialmente reembolsada/
reembolsada/em contestação/chargeback/cancelada/expirada; transação pendente/
em análise/aprovada/rejeitada/cancelada/reembolsada/em contestação/chargeback.
O mapeamento exato depende do recurso e versão da API e deve preservar status e
detalhe originais. Falha técnica de criar checkout não equivale a pagamento rejeitado.

## Segurança e operação na infraestrutura atual

- Access Token e segredo de assinatura somente no backend; nunca em `NEXT_PUBLIC_*`.
- Cliente consulta somente resumos da própria empresa por API/RLS; não insere ou
  atualiza pagamentos. Usuários administrativos recebem apenas o acesso necessário.
- Webhook não terá JWT de cliente. Precisa de caminho público HTTPS específico,
  validação de assinatura e rate/body limits; não expor toda a API privada.
  Planejar roteamento Caddy ou adaptador Next para esse único caminho.
- A aplicação atual não usa service role. Para processamento sem sessão humana,
  definir papel de banco restrito a funções transacionais de pagamentos, ou solução
  equivalente com privilégio mínimo; não ampliar todo o runtime com uma chave ampla.
- Fila persistente de eventos/retries no PostgreSQL e worker leve com concorrência
  limitada. Proposta para a VPS de 2 GB: evitar introduzir Redis/RabbitMQ sem medição.
- Métricas e alertas: eventos parados, pagamentos divergentes, cobranças duplicadas,
  reservas vencidas, falhas de credenciais e última conciliação bem-sucedida.
- Pausa do Supabase pode impedir criar cobrança ou persistir notificações. Sem
  persistência durável não responder sucesso ao webhook. Retentativas do provedor
  não substituem a conciliação após reativação. Não garantir atualização imediata
  enquanto o banco estiver pausado.

## Sequência de implementação e aceite

1. Fechar recebedor, checkout, meios, prazos, estoque e políticas de exceção.
2. Especificar contrato da API escolhida, modelo/estados, telas e permissões;
   adicionar migrations, tipos/contratos e documentação no mesmo GitHub.
3. Testar schema/RLS em Supabase descartável; planejar classificação dos pedidos
   anteriores e rollback funcional sem apagar registros financeiros.
4. Implementar módulo de pagamentos na API: criação, consulta, webhook, reconciliação
   e reembolso com permissão administrativa. Cobrir timeout e falha entre etapas.
5. Implementar cliente (pagar, continuar pagamento, pendente, resultado, histórico)
   e painel administrativo (bruto/taxas/líquido, situação, filtro, vínculo e estornos).
6. Homologar com credenciais/contas de teste: aprovado, rejeitado, análise, abandono,
   repetição de clique, timeout, evento duplicado/fora de ordem/assinatura inválida,
   webhook ausente, divergência de valor/recebedor, banco indisponível, expiração,
   pagamento tardio, estorno parcial/integral e isolamento entre empresas.
7. Backup, migration aditiva e release controlado com feature flag. Validar uma
   transação real supervisionada e reconciliação antes de liberar para clientes.

Critérios: nenhum pedido liberado sem condição financeira exigida; nenhum browser
pode alterar o valor ou marcar como pago; eventos repetidos não duplicam efeitos;
todo valor recebido/reembolsado tem vínculo, origem e histórico; rotina recupera
interrupções; dados financeiros sobrevivem ao rollback da aplicação.

## Fontes oficiais consultadas em 27/10/2026

- [Soluções e experiências de checkout](https://www.mercadopago.com.br/developers/pt/docs/getting-started)
- [Criar aplicação](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/create-application?scope=prod)
- [Checkout Pro via Orders: criação, referência e idempotência](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/create-order?scope=prod)
- [Webhooks de pagamento e assinatura](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/notifications?scope=prod)
- [Contas de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/test-accounts)

A documentação consultada separa Checkout Pro via Preferences e via Orders.
Escolher uma variante disponível para a aplicação e seguir seu contrato inteiro;
não combinar endpoints, estados ou estratégias de teste de variantes diferentes.
Revalidar detalhes na implementação. As regras financeiras e de banco deste plano
são propostas para a Farta, não requisitos atribuídos ao Mercado Pago.
