import { Category } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class UpdateArticleDto {
  @ApiPropertyOptional({ description: 'The title of the article' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'The content/body of the article' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'The category enum', enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ description: 'Optional cover image URL' })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Is the article published' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
