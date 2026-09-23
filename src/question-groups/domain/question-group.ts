import { ToeicTest } from '../../toeic-tests/domain/toeic-test';

import { ApiProperty } from '@nestjs/swagger';

export class QuestionGroup {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  orderIndex?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  imageUrl?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  audioUrl?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  passageText?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  title?: string | null;

  @ApiProperty({
    type: () => ToeicTest,
    nullable: false,
  })
  toeicTest: ToeicTest;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
