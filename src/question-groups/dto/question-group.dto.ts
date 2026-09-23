import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
