import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Article, Category, Role } from '@prisma/client';
import { ArticlesService, PaginatedArticles } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request-with-user.interface';
import { APP_CONSTANTS } from '../common/constants/app.constants';

@ApiTags('Articles')
@ApiBearerAuth()
@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  private readonly logger: Logger = new Logger(ArticlesController.name);

  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully.' })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: RequestWithUser,
  ): Promise<Article> {
    this.logger.log(`POST /articles by user ${req.user.id}`);
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination and filtering' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['date', 'views', 'likes'],
  })
  @ApiQuery({ name: 'category', required: false, enum: Category })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  findAll(
    @Request() req: RequestWithUser,
    @Query('sortBy') sortBy?: 'date' | 'views' | 'likes',
    @Query('category') category?: Category,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedArticles> {
    const pageNumber = page
      ? Number.parseInt(page, 10)
      : APP_CONSTANTS.DEFAULT_PAGE;
    const limitNumber = limit
      ? Number.parseInt(limit, 10)
      : APP_CONSTANTS.DEFAULT_LIMIT;
    this.logger.log(
      `GET /articles sortBy=${sortBy} category=${category} page=${pageNumber} limit=${limitNumber}`,
    );
    return this.articlesService.findAll(
      sortBy,
      category,
      pageNumber,
      limitNumber,
      req.user.role,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single article by ID' })
  findOne(@Param('id') id: string): Promise<Article> {
    this.logger.log(`GET /articles/${id}`);
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Update an article' })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    this.logger.log(`PATCH /articles/${id}`);
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete an article' })
  remove(@Param('id') id: string): Promise<Article> {
    this.logger.log(`DELETE /articles/${id}`);
    return this.articlesService.remove(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like an article' })
  like(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<Article> {
    this.logger.log(`POST /articles/${id}/like by user ${req.user.id}`);
    return this.articlesService.like(id);
  }
}
