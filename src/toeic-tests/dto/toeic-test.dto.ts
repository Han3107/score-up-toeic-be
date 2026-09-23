import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToeicTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
