import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, Category, Prisma, Role } from '@prisma/client';
import { APP_CONSTANTS } from '../common/constants/app.constants';

export interface PaginatedArticles {
  data: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ArticlesService {
  private readonly logger: Logger = new Logger(ArticlesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(
    createArticleDto: CreateArticleDto,
    authorId: string,
  ): Promise<Article> {
    this.logger.log(
      `Creating article: ${createArticleDto.title} by author ${authorId}`,
    );

    const baseSlug: string = this.generateSlug(createArticleDto.title);
    const slug: string = `${baseSlug}-${Date.now()}`;

    const publishedAt: Date | null = createArticleDto.published
      ? new Date()
      : null;

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        slug,
        content: createArticleDto.content,
        category: createArticleDto.category,
        coverImage: createArticleDto.coverImage,
        published: createArticleDto.published ?? false,
        publishedAt,
        authorId,
      },
    });
  }

  async findAll(
    sortBy: 'date' | 'views' | 'likes' = 'date',
    category?: Category,
    page: number = APP_CONSTANTS.DEFAULT_PAGE,
    limit: number = APP_CONSTANTS.DEFAULT_LIMIT,
    role?: Role,
  ): Promise<PaginatedArticles> {
    this.logger.log(
      `Fetching all articles page=${page} limit=${limit} role=${role}`,
    );

    const safeLimit = Math.min(Math.max(1, limit), APP_CONSTANTS.MAX_LIMIT);
    const safePage = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;

    const sortMap: Record<string, Prisma.ArticleOrderByWithRelationInput> = {
      views: { views: 'desc' },
      likes: { likes: 'desc' },
      date: { publishedAt: 'desc' },
    };
    const orderBy = sortMap[sortBy] || { publishedAt: 'desc' };

    const where: Prisma.ArticleWhereInput = {};
    if (category) {
      where.category = category;
    }

    if (role === Role.READER) {
      where.published = true;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: safeLimit,
      }),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findOne(id: string): Promise<Article> {
    this.logger.log(`Fetching article with ID to increment views: ${id}`);

    const article: Article | null = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      this.logger.warn(`Article not found: ${id}`);
      throw new NotFoundException('Article not found');
    }

    return this.prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    this.logger.log(`Updating article: ${id}`);

    const article: Article | null = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const data: Prisma.ArticleUpdateInput = {};
    if (updateArticleDto.title !== undefined)
      data.title = updateArticleDto.title;
    if (updateArticleDto.content !== undefined)
      data.content = updateArticleDto.content;
    if (updateArticleDto.category !== undefined)
      data.category = updateArticleDto.category;
    if (updateArticleDto.coverImage !== undefined)
      data.coverImage = updateArticleDto.coverImage;
    if (updateArticleDto.published !== undefined)
      data.published = updateArticleDto.published;

    if (updateArticleDto.title) {
      const baseSlug: string = this.generateSlug(updateArticleDto.title);
      data.slug = `${baseSlug}-${Date.now()}`;
    }

    if (updateArticleDto.published === true && !article.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Article> {
    this.logger.log(`Removing article: ${id}`);

    const article: Article | null = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.article.delete({
      where: { id },
    });
  }

  async like(id: string): Promise<Article> {
    this.logger.log(`Liking article: ${id}`);

    const article: Article | null = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      this.logger.warn(`Liking failed, article not found: ${id}`);
      throw new NotFoundException('Article not found');
    }

    return this.prisma.article.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }
}
