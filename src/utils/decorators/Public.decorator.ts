import { SetMetadata } from '@nestjs/common';

// Define a key for your metadata
export const IS_PUBLIC_KEY = 'isPublic';

// Create the custom decorator
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

