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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Article, Category, Role } from '@prisma/client';

interface RequestWithUser {
  user: {
    id: string;
    role: Role;
    email: string;
    username: string;
  };
}

@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  private readonly logger: Logger = new Logger(ArticlesController.name);

  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: RequestWithUser,
  ): Promise<Article> {
    this.logger.log(`POST /articles by user ${req.user.id}`);
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('sortBy') sortBy?: 'date' | 'views' | 'likes',
    @Query('category') category?: Category,
  ): Promise<Article[]> {
    this.logger.log(`GET /articles sortBy=${sortBy} category=${category}`);
    return this.articlesService.findAll(sortBy, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    this.logger.log(`GET /articles/${id}`);
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    this.logger.log(`PATCH /articles/${id}`);
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<Article> {
    this.logger.log(`DELETE /articles/${id}`);
    return this.articlesService.remove(id);
  }
}
