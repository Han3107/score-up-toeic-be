import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  examId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  score: number;
}
