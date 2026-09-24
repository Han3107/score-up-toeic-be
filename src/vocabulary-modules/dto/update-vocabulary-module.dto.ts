// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyModuleDto } from './create-vocabulary-module.dto';

export class UpdateVocabularyModuleDto extends PartialType(
  CreateVocabularyModuleDto,
) {}
