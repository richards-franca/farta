# Operação da Farta na VPS

## Entenda as peças

Imagem é o pacote imutável construído pelo GitHub. Container é um processo iniciado
a partir dessa imagem. Rede permite a comunicação entre containers. Volume mantém
dados depois de substituir containers. Compose descreve como iniciar o conjunto.

A V1 executa Caddy (HTTPS), Next.js (interface/sessão) e Fastify (casos de uso).
Banco, usuários e arquivos ficam no Supabase Cloud. Os volumes locais guardam os
certificados do Caddy; não são uma cópia do banco.

## Organização

Código na máquina e no mesmo repositório GitHub; backend em `services/api`, contratos
em `packages/contracts`, infraestrutura em `infra`. Na VPS, configuração em
`/opt/farta`, scripts em `bin`, versões implantadas em `releases`.

## Desenvolvimento local

1. `npm ci` na raiz do repositório.
2. Configurar `.env.local` a partir de `.env.example`, usando ambiente de teste.
3. Em um terminal: `npm run dev:api`. Em outro: `npm run dev`.
4. `FARTA_API_URL` pode apontar para `http://127.0.0.1:3001` no desenvolvimento.
5. `npm run check` executa lint, tipos, builds e testes de contrato/autorização.

Não adicionar regras de negócio às Server Actions: elas apenas encaminham à API.
Adicionar o endpoint explícito, schema, contrato, autorização e testes junto ao caso
de uso. Não usar service role para contornar uma falha de permissão.

## Instalação inicial e acesso

Ubuntu 22.04.5; SSH confirmado na porta 22022. O acesso anterior em 12012 não foi
confirmado novamente. Use a chave administrativa criada na máquina do usuário:

```powershell
ssh -i "$env:USERPROFILE\.ssh\farta_admin_ed25519" -p 22022 farta@143.95.174.202
```

Essa chave privada fica fora do repositório e precisa de uma cópia pessoal segura.
O grupo Docker dá poderes administrativos sobre os containers e o host; não conceder
esse acesso a usuários de aplicação.

`infra/bootstrap.sh`, executado como root, instala Docker/Compose, cria o usuário,
configura swap e libera HTTP/HTTPS preservando o SSH atual. O script não apaga volumes.
Os arquivos de operação são instalados como root e o deploy escreve apenas em releases.

`/opt/farta/app.env` contém as variáveis do exemplo em `infra/.env.example`, com
permissão 640 e grupo farta. Não executar `docker compose config` em logs públicos,
pois a saída pode incluir valores do ambiente.

## Publicar pelo GitHub

Configurar as variáveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
e `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`. São valores públicos incorporados ao frontend.
Os secrets `FARTA_SSH_PRIVATE_KEY` e `FARTA_SSH_KNOWN_HOSTS` protegem o deploy.

O workflow **Build and deploy VPS** recebe o SHA completo de um commit. Ele executa
testes num Supabase descartável no runner, valida os dois projetos e constrói as
imagens no GitHub. A VPS só baixa imagens prontas. Não há compilação na VPS.

O GitHub usa uma chave diferente da administrativa, restrita a login no registry,
deploy e rollback. O token temporário do job autoriza o download das imagens e expira
com o job. Não copiar tokens do GitHub para o código ou para o frontend.

`vercel.json` desabilita novos deploys automáticos para manter o deployment estável como
referência de recuperação. Não remover essa configuração enquanto a Vercel depender
de uma versão da aplicação anterior à API privada.

O deploy usa digests, verifica os serviços e registra o commit. Falhas tentam
restaurar a versão registrada anteriormente. A primeira instalação ainda não possui
uma versão Docker anterior; a Vercel continua sendo a referência estável inicial.

## Domínio e Auth

`farta.site` aponta para 143.95.174.202; `www` aponta para o domínio principal.
Caddy obtém e renova certificados. As portas 80/443 também precisam estar liberadas
no painel do provedor. Não publicar 3000/3001 no host.

Configurar no Supabase Auth o Site URL `https://farta.site` e os retornos
`https://farta.site/auth/callback` e `https://farta.site/auth/reset-password`.
Manter os retornos exatos da Vercel enquanto ela for a alternativa de recuperação.
O callback do provedor Google continua sendo o do Supabase Cloud. Conferir também
as origens autorizadas no Google. Não aplicar `supabase config push` sem revisar
o conjunto de alterações de Auth: a configuração local não é produção.

O arquivo mínimo de produção está em `infra/supabase-auth/supabase/config.toml`.
Usar CLI 2.122.0 e conferir `config diff` com `--workdir infra/supabase-auth` e
`--project-ref` explícito antes de publicar. Apenas Site URL e retornos são declarados;
configurações de Google, MFA e e-mail existentes precisam permanecer preservadas.

## Inspecionar e recuperar

```bash
cd /opt/farta
docker compose --env-file app.env --env-file releases/current.env -f compose.yml ps
docker stats --no-stream
docker compose --env-file app.env --env-file releases/current.env -f compose.yml logs --tail 50 api
/opt/farta/bin/deploy.sh rollback
```

`/api/health` verifica o processo web. API possui `/health/live` (processo) e
`/health/ready` (dependência Supabase), acessíveis internamente. Um container
unhealthy não é reiniciado automaticamente apenas por esse estado; acompanhar alertas
e investigar. Reinício automático cobre encerramento do processo.

O timer `farta-monitor.timer` executa verificações a cada cinco minutos. Avisos
locais podem ser consultados com `journalctl -t farta-monitor`. Ele não envia e-mail
nem mensagens externas. Após testar as chaves, `infra/harden-ssh.sh` desabilita login
por senha, preservando a porta e o acesso por chave.

Se o Supabase pausar, reativá-lo no painel. Não trocar o banco nem reaplicar migrations
para resolver uma pausa. Retornar à Vercel não resolve indisponibilidade do mesmo banco.
Nunca repetir automaticamente pedidos após timeout: consultar o estado antes.

## Backups e capacidade

Antes de migrations, exportar roles, schema e dados com o CLI Supabase e copiar os
arquivos do Storage separadamente. Guardar cópia criptografada fora da VPS e testar
a restauração em ambiente isolado. Não versionar dumps ou backups no GitHub.

`node scripts/backup-cloud.mjs` executa esse backup na máquina Windows com o CLI
Supabase já autenticado. A chave AES fica em `~/.ssh/farta_backup.key`; os arquivos
criptografados ficam em `~/Documents/Farta-private-backups`. Guardar uma cópia segura
da chave separada dos backups. O script também exporta os objetos do Storage.
Para recuperar um arquivo: `node scripts/decrypt-backup.mjs arquivo.aes destino`.
O destino descriptografado deve ficar fora do repositório. A autenticação AES verifica
integridade; uma restauração completa do banco exige um Supabase isolado compatível.

Manter a imagem anterior para rollback; não executar limpeza que a remova.
Logs têm rotação e os serviços têm limites de memória. Swap reduz a chance de
encerramento abrupto, mas não substitui RAM. Verificar CPU, memória e disco durante
o piloto. Os limites iniciais precisam de medição sob carga real.

## Validação antes dos clientes

- Conferir login/sessão e fluxo completo de pedido com contas autorizadas.
- Validar papéis, acesso entre empresas, convites, imagens e exportações.
- Ensaiar retorno de versão, preservando o mesmo banco.
- Executar ensaio de 10 usuários simultâneos por 15 minutos e conferir ausência
  de OOM, reinícios e erros; memória sustentada acima de 80% exige ajuste.
- Registrar os resultados reais; testes com fixtures não comprovam configuração
  do banco Cloud, Google OAuth ou comportamento sob carga na VPS.

`FARTA_LIVE_SMOKE=1 node scripts/smoke-vps.mjs 900` mede dez acessos concorrentes
autenticados à identidade via Next.js/API usando uma conta temporária sem empresa.
Não cria pedidos de clientes; testes comerciais são executados no Supabase isolado
do CI. Relatórios agregados ficam em `docs/deployment/validation`, sem tokens.
Após confirmar que nenhum ensaio está ativo, `FARTA_LIVE_SMOKE=1 node
scripts/cleanup-smoke.mjs` recupera a limpeza de fixtures interrompidas. O script
recusa contas fora de seu prefixo ou perfis ativados/vinculados e respeita FKs.

O ensaio CI injeta o seed antes das migrations históricas de demonstração que
dependem dele. Essa preparação ocorre apenas no checkout descartável do runner;
não altera o histórico de migrations do projeto nem deve ser enviada ao Cloud.
