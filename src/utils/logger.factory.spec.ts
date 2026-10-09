import { loggerOptionsFactory } from './logger.factory';
import { ConfigService } from '@nestjs/config';

describe('LoggerFactory', () => {
  it('should generate a uuid and set X-Request-Id header', () => {
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('info'),
      get: jest.fn().mockReturnValue('development'),
    } as any;
    const options = loggerOptionsFactory(configService as ConfigService);

    const req = { id: undefined };
    const res = { setHeader: jest.fn() };

    const reqId = options.pinoHttp.genReqId(req as any, res as any);

    expect(reqId).toBeDefined();
    expect(typeof reqId).toBe('string');
    expect(reqId.length).toBeGreaterThan(30); // UUID length
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', reqId);
  });

  it('should include redact paths', () => {
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('info'),
      get: jest.fn().mockReturnValue('development'),
    } as any;
    const options = loggerOptionsFactory(configService as ConfigService);
    expect(options.pinoHttp.redact).toContain('req.headers.authorization');
    expect(options.pinoHttp.redact).toContain('req.body.password');
  });
});
