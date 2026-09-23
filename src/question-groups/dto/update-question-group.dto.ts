// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateQuestionGroupDto } from './create-question-group.dto';

export class UpdateQuestionGroupDto extends PartialType(
  CreateQuestionGroupDto,
) {}
