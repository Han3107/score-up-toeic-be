import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VocabularyModuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
