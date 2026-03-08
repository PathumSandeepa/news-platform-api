import { Category } from '@prisma/client';

export class CreateArticleDto {
  title: string;
  content: string;
  category: Category;
  coverImage?: string;
  published?: boolean;
}
