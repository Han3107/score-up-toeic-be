import { QuestionGroup } from '../../question-groups/domain/question-group';

import { ToeicTest } from '../../toeic-tests/domain/toeic-test';

import { ApiProperty } from '@nestjs/swagger';

export class Question {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  orderIndex?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  explanation?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  correctAnswer: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  options: string[];

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  prompt: string;

  @ApiProperty({
    type: () => QuestionGroup,
    nullable: true,
  })
  questionGroup?: QuestionGroup | null;

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
