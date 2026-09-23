import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { ToeicTestsService } from './toeic-tests.service';
import { ToeicTestsController } from './toeic-tests.controller';
import { DocumentToeicTestPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { QuestionsModule } from '../questions/questions.module';
import { QuestionGroupsModule } from '../question-groups/question-groups.module';

@Module({
  imports: [
    // do not remove this comment
    DocumentToeicTestPersistenceModule,
    forwardRef(() => QuestionsModule),
    forwardRef(() => QuestionGroupsModule),
  ],
  controllers: [ToeicTestsController],
  providers: [ToeicTestsService],
  exports: [ToeicTestsService, DocumentToeicTestPersistenceModule],
})
export class ToeicTestsModule {}
