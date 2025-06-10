import { SetMetadata } from '@nestjs/common';

// Decorator to make route public
export const IS_PUBLIC__KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC__KEY, true);
