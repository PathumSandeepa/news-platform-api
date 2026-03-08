import { Category } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'New Tech Framework Released',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content/body of the article',
    example: 'This framework will change everything...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The category enum',
    enum: Category,
    example: Category.TECHNOLOGY,
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiPropertyOptional({
    description: 'Optional cover image URL',
    example: 'https://example.com/image.png',
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Is the article published',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
