import { ApiProperty } from '@nestjs/swagger';

export class UserLeaderboard {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Number })
  averageScore: number;

  @ApiProperty({ type: Number })
  totalCompletedExams: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
