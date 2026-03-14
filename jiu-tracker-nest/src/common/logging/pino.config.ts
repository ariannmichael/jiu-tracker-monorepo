import { randomUUID } from 'crypto';
import { Params } from 'nestjs-pino';

const isProduction = process.env.NODE_ENV === 'production';

function normalizePath(url?: string): string {
  return (url ?? '').split('?')[0] ?? '';
}

function readRequestId(header: string | string[] | undefined): string | undefined {
  if (Array.isArray(header)) {
    return header[0];
  }

  return header;
}

export const pinoLoggerConfig: Params = {
  pinoHttp: {
    level: isProduction ? 'info' : 'debug',
    transport: isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
    genReqId: (req, res) => {
      const requestId = readRequestId(req.headers['x-request-id']) ?? randomUUID();
      res.setHeader('x-request-id', requestId);
      return requestId;
    },
    autoLogging: {
      ignore: (req) => {
        const path = normalizePath(req.url);
        return path === '/health' || path === '/metrics';
      },
    },
    customProps: (req) => ({
      requestId: (req as { id?: string }).id,
    }),
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.receipt',
      'req.body.avatar',
    ],
  },
};
