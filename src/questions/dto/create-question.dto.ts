import { QuestionGroupDto } from '../../question-groups/dto/question-group.dto';

import { ToeicTestDto } from '../../toeic-tests/dto/toeic-test.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  orderIndex?: number | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  explanation?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  correctAnswer: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    required: false,
    type: () => QuestionGroupDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => QuestionGroupDto)
  @IsNotEmptyObject()
  questionGroup?: QuestionGroupDto | null;

  @ApiProperty({
    required: true,
    type: () => ToeicTestDto,
  })
  @ValidateNested()
  @Type(() => ToeicTestDto)
  @IsNotEmptyObject()
  toeicTest: ToeicTestDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
