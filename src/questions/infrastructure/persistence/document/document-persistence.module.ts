import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionSchema,
  QuestionSchemaClass,
} from './entities/question.schema';
import { QuestionRepository } from '../question.repository';
import { QuestionDocumentRepository } from './repositories/question.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionSchemaClass.name, schema: QuestionSchema },
    ]),
  ],
  providers: [
    {
      provide: QuestionRepository,
      useClass: QuestionDocumentRepository,
    },
  ],
  exports: [QuestionRepository],
})
export class DocumentQuestionPersistenceModule {}
