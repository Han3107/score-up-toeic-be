import { ApiProperty } from '@nestjs/swagger';

export class ExamResult {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  examId: string;

  @ApiProperty({ type: Number })
  score: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
