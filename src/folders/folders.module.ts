import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { DocumentFolderPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { VocabularyModulesModule } from '../vocabulary-modules/vocabulary-modules.module';

@Module({
  imports: [
    // do not remove this comment
    DocumentFolderPersistenceModule,
    forwardRef(() => VocabularyModulesModule),
  ],
  controllers: [FoldersController],
  providers: [FoldersService],
  exports: [FoldersService, DocumentFolderPersistenceModule],
})
export class FoldersModule {}
