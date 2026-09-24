import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VocabularyModuleSchema,
  VocabularyModuleSchemaClass,
} from './entities/vocabulary-module.schema';
import { VocabularyModuleRepository } from '../vocabulary-module.repository';
import { VocabularyModuleDocumentRepository } from './repositories/vocabulary-module.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VocabularyModuleSchemaClass.name,
        schema: VocabularyModuleSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: VocabularyModuleRepository,
      useClass: VocabularyModuleDocumentRepository,
    },
  ],
  exports: [VocabularyModuleRepository],
})
export class DocumentVocabularyModulePersistenceModule {}
