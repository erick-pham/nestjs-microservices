import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = process.hrtime.bigint();
    const { ip, method, originalUrl, ips } = request;
    const clientIps = ips && ips.length > 0 ? ips.join(',') : ip;

    const userAgent = request.get('user-agent') || '';
    const referer = request.get('referer') || '';
    const requestId = randomUUID();

    request.headers['Request-Id'] = requestId;
    response.setHeader('Request-Id', requestId);

    response.on('close', () => {
      const endTime = process.hrtime.bigint();
      const elapsedTimeInNanoSeconds = Number(endTime - startTime);
      const elapsedTimeInMilliseconds = elapsedTimeInNanoSeconds / 1e6;

      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${Math.round(
          elapsedTimeInMilliseconds
        )}ms ${originalUrl} ${statusCode} ${contentLength} - ${referer} ${userAgent} ${clientIps}`,
        `HTTP#${requestId}`
      );
    });

    next();
  }
}
