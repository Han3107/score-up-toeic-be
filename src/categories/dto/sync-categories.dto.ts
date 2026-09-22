import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SyncCategoryItemDto {
  @ApiProperty({ example: 'Grammar', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Grammar topics', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class SyncCategoriesDto {
  @ApiProperty({
    type: [SyncCategoryItemDto],
    description: 'List of default categories to sync',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCategoryItemDto)
  categories: SyncCategoryItemDto[];
}
