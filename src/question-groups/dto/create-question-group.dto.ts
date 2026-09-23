import { ToeicTestDto } from '../../toeic-tests/dto/toeic-test.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateQuestionGroupDto {
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
  imageUrl?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  audioUrl?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  passageText?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  title?: string | null;

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
