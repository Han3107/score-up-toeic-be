import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { VocabularyModulesService } from './vocabulary-modules.service';
import { VocabularyModulesController } from './vocabulary-modules.controller';
import { DocumentVocabularyModulePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [
    // do not remove this comment
    DocumentVocabularyModulePersistenceModule,
    forwardRef(() => FoldersModule),
  ],
  controllers: [VocabularyModulesController],
  providers: [VocabularyModulesService],
  exports: [
    VocabularyModulesService,
    DocumentVocabularyModulePersistenceModule,
  ],
})
export class VocabularyModulesModule {}
