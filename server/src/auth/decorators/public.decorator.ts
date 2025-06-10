import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC__KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC__KEY, true);
