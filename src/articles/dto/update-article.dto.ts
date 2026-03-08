import { Category } from '@prisma/client';

export class UpdateArticleDto {
  title?: string;
  content?: string;
  category?: Category;
  coverImage?: string;
  published?: boolean;
}
