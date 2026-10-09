import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { AllConfigType } from '../config/config.type';

export const loggerOptionsFactory = (
  configService: ConfigService<AllConfigType>,
) => {
  const nodeEnv = configService.get('app.nodeEnv', { infer: true });
  const logLevel = configService.getOrThrow('app.logLevel', { infer: true });

  return {
    pinoHttp: {
      level: logLevel,
      transport:
        nodeEnv !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            }
          : undefined,
      genReqId: (req: any, res: any) => {
        const id = req.id || crypto.randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.oldPassword',
        'req.body.token',
        'req.body.refreshToken',
      ],
    },
  };
};
