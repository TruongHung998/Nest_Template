import { SetMetadata } from '@nestjs/common';

/* 
    Bypass AuthGuard public route
    @Public()
*/
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
