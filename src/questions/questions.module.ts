import { QuestionGroupsModule } from '../question-groups/question-groups.module';
import { ToeicTestsModule } from '../toeic-tests/toeic-tests.module';
import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DocumentQuestionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    QuestionGroupsModule,

    forwardRef(() => ToeicTestsModule),

    // do not remove this comment
    DocumentQuestionPersistenceModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, DocumentQuestionPersistenceModule],
})
export class QuestionsModule {}
