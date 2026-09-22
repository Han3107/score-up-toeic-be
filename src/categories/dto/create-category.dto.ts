import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    required: false,
    type: () => Number,
    description: 'Custom sort order. Defaults to Max+1 if omitted.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number;

  @ApiProperty({
    required: false,
    enum: ['ACTIVE', 'HIDDEN'],
    default: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'HIDDEN'])
  status?: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    type: () => String,
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;
}
