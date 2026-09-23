import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionGroupSchema,
  QuestionGroupSchemaClass,
} from './entities/question-group.schema';
import { QuestionGroupRepository } from '../question-group.repository';
import { QuestionGroupDocumentRepository } from './repositories/question-group.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionGroupSchemaClass.name, schema: QuestionGroupSchema },
    ]),
  ],
  providers: [
    {
      provide: QuestionGroupRepository,
      useClass: QuestionGroupDocumentRepository,
    },
  ],
  exports: [QuestionGroupRepository],
})
export class DocumentQuestionGroupPersistenceModule {}
