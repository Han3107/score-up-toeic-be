import { IsEnum, IsString, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateToeicTestDto {
  deletedAt?: Date | null;

  @ApiProperty({
    required: false,
    enum: ['DRAFT', 'PUBLISHED', 'HIDDEN'],
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'HIDDEN'])
  status?: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  category?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
