import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import { routes } from '@farta/contracts';
import { operationSchemas } from '@farta/contracts/schemas';
import { operations } from './operations.js';
import { ApiError, authenticate, authorize, type ApiConfig } from './auth.js';
import { requestContext, type RequestContext } from './context.js';
import { exportOrder } from './export.js';

export interface AppOptions extends ApiConfig {
  logger?: boolean;
  authenticate?: (token: string) => Promise<RequestContext>;
}
export async function buildApp(options: AppOptions) {
  const app = Fastify({
    logger: options.logger ? { redact: ['req.headers.authorization','req.headers.cookie','req.headers.x-farta-internal-key'], serializers: { req: req => ({ method: req.method, url: req.url.split('?')[0] }) } } : false,
    bodyLimit: 1024 * 1024, requestTimeout: 30_000,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false, strictTuples:false } },
  });
  await app.register(swagger, { openapi: { info: { title:'Farta internal API', version:'1.0.0' }, components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer'}}} } });
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024, files:1, fields:1, parts:2 } });
  await app.register(rateLimit, { max:120, timeWindow:'1 minute', global:false, hook:'preHandler' });
  const contexts = new WeakMap<object,RequestContext>();
  const verify = options.authenticate ?? ((token: string) => authenticate(token, options));
  async function contextFor(authHeader: string | undefined, selection: unknown, operation: string) {
    if (!authHeader?.startsWith('Bearer ') || authHeader.length > 16_384) throw new ApiError(401,'UNAUTHENTICATED','Entre novamente para continuar.');
    const context = await verify(authHeader.slice(7));
    if (typeof selection === 'string' && /^[0-9a-f-]{36}$/i.test(selection)) context.establishmentId = selection;
    await authorize(context,operation);
    return context;
  }
  app.get('/health/live', async () => ({ status:'ok' }));
  app.get('/health/ready', async (_request, reply) => {
    try {
      const res = await (options.fetch ?? fetch)(`${options.supabaseUrl}/auth/v1/health`,{headers:{apikey:options.supabaseKey},signal:AbortSignal.timeout(5000)});
      if (!res.ok) return reply.code(503).send({status:'unavailable'});
      return {status:'ok'};
    } catch { return reply.code(503).send({status:'unavailable'}); }
  });
  app.get('/openapi.json', async (request) => {
    const context = await contextFor(request.headers.authorization, undefined,'identity.me');
    if (context.profile.role !== 'PLATFORM_ADMIN' || context.profile.status !== 'ACTIVE') throw new ApiError(403,'FORBIDDEN','Acesso não autorizado.');
    return app.swagger();
  });
  app.get('/v1/identity/me', async (request) => {
    const context = await contextFor(request.headers.authorization, undefined,'identity.me');
    const {data: company,error} = context.profile.company_id ? await context.supabase.from('companies').select('display_name').eq('id',context.profile.company_id).maybeSingle() : {data:null,error:null};
    if(error || context.upstreamFailed) throw new ApiError(503,'UPSTREAM_UNAVAILABLE','Não foi possível consultar seu perfil.');
    return { user:context.user, profile:context.profile, company };
  });
  for (const [key,route] of Object.entries(routes)) {
    app.post(route.path, {
      onRequest:async request=>{ contexts.set(request,await contextFor(request.headers.authorization,request.headers['x-establishment-id'],key)); },
      config: { rateLimit: { max:120,timeWindow:'1 minute',keyGenerator:request=>contexts.get(request)?.user.id ?? request.ip } },
      schema: { tags:[key.split('.')[0]], security:[{bearerAuth:[]}], ...(route.upload ? {} : {body:operationSchemas[key]}) },
    }, async (request) => {
      const context = contexts.get(request)!;
      let args: unknown[];
      if (route.upload) {
        let input: Record<string,unknown> | undefined;
        let file: File | undefined;
        for await (const part of request.parts()) {
          if (part.type === 'file') {
            if (part.fieldname !== 'file') throw new ApiError(400,'INVALID_FILE','Arquivo inválido.');
            const buffer = await part.toBuffer();
            const kind = imageType(buffer);
            if (!kind || kind !== part.mimetype) throw new ApiError(400,'INVALID_FILE','Use uma imagem JPEG, PNG ou WebP válida.');
            file = new File([new Uint8Array(buffer)],'upload',{type:kind});
          } else if (part.fieldname === 'input' && typeof part.value === 'string' && part.value.length <= 16_384) {
            try { input = JSON.parse(part.value); } catch { throw new ApiError(400,'INVALID_INPUT','Dados inválidos.'); }
          } else throw new ApiError(400,'INVALID_INPUT','Dados inválidos.');
        }
        if (!file || !input || !app.getSchema(key)) throw new ApiError(400,'INVALID_INPUT','Dados e arquivo são obrigatórios.');
        const validator = request.compileValidationSchema(operationSchemas[key]);
        if (!validator({args:[input]})) throw new ApiError(400,'INVALID_INPUT','Dados inválidos.');
        args = [{...input,file}];
      } else args = (request.body as {args:unknown[]}).args.map(value=>value===null?undefined:value);
      return requestContext.run(context, async () => {
        const handler = operations[key as keyof typeof operations] as (...args: unknown[]) => Promise<unknown>;
        const result = await handler(...args);
        if(context.upstreamFailed) throw new ApiError(503,'UPSTREAM_UNAVAILABLE','Serviço temporariamente indisponível.');
        return result;
      });
    });
  }
  for (const key of Object.keys(routes)) app.addSchema({$id:key,...operationSchemas[key]});
  app.get('/v1/orders/:orderId/export',async(request,reply)=>{
    const context=await contextFor(request.headers.authorization,request.headers['x-establishment-id'],'admin.admin.getCompanyOrderDetails');
    return requestContext.run(context,()=>exportOrder(request,reply));
  });
  app.setErrorHandler((error,request,reply)=>{
    const httpError=error as {validation?:unknown;statusCode?:number};
    const status = error instanceof ApiError ? error.statusCode : httpError.validation ? 400 : httpError.statusCode === 413 ? 413 : httpError.statusCode === 429 ? 429 : 500;
    const code = error instanceof ApiError ? error.code : status===400?'INVALID_INPUT':status===429?'RATE_LIMITED':status===413?'PAYLOAD_TOO_LARGE':'INTERNAL_ERROR';
    const message = error instanceof ApiError ? error.message : status===400?'Confira os dados informados.':status===429?'Muitas solicitações. Aguarde um instante.':status===413?'Arquivo ou dados acima do limite permitido.':'Não foi possível concluir a operação.';
    request.log.warn({code,status,requestId:request.id},'Request failed');
    return reply.code(status).send({ok:false,message,code,requestId:request.id});
  });
  return app;
}
export function imageType(buffer: Uint8Array): string | undefined {
  if(buffer.length>=3 && buffer[0]===0xff && buffer[1]===0xd8 && buffer[2]===0xff) return 'image/jpeg';
  if(buffer.length>=8 && Buffer.from(buffer.subarray(0,8)).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if(buffer.length>=12 && Buffer.from(buffer.subarray(0,4)).toString()==='RIFF' && Buffer.from(buffer.subarray(8,12)).toString()==='WEBP') return 'image/webp';
}
