import { ToeicTestsModule } from '../toeic-tests/toeic-tests.module';
import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { QuestionGroupsService } from './question-groups.service';
import { QuestionGroupsController } from './question-groups.controller';
import { DocumentQuestionGroupPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    forwardRef(() => ToeicTestsModule),

    // do not remove this comment
    DocumentQuestionGroupPersistenceModule,
  ],
  controllers: [QuestionGroupsController],
  providers: [QuestionGroupsService],
  exports: [QuestionGroupsService, DocumentQuestionGroupPersistenceModule],
})
export class QuestionGroupsModule {}
