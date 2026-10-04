import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailVerificationConfirmDto {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
