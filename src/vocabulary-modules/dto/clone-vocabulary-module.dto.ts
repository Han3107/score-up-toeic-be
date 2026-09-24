import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CloneVocabularyModuleDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  targetFolderId?: string;
}
