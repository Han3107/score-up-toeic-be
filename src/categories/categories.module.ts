import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DocumentCategoryPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    DocumentCategoryPersistenceModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, DocumentCategoryPersistenceModule],
})
export class CategoriesModule {}
