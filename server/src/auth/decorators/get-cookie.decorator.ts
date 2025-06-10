import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const cookies = request.cookies;
    return data ? cookies?.[data] : cookies;
  },
);
