import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVocabularyTermDto {
  @ApiProperty({ type: String, maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  term: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  definition: string;
}

export class CreateVocabularyModuleDto {
  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  @IsString()
  folderId?: string | null;

  @ApiPropertyOptional({
    type: () => String,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    type: () => [CreateVocabularyTermDto],
    description: 'Max 500 terms allowed per module',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => CreateVocabularyTermDto)
  terms?: CreateVocabularyTermDto[];
}
