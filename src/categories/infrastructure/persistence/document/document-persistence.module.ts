import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySchema,
  CategorySchemaClass,
} from './entities/category.schema';
import { CategoryRepository } from '../category.repository';
import { CategoryDocumentRepository } from './repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategorySchemaClass.name, schema: CategorySchema },
    ]),
  ],
  providers: [
    {
      provide: CategoryRepository,
      useClass: CategoryDocumentRepository,
    },
  ],
  exports: [CategoryRepository],
})
export class DocumentCategoryPersistenceModule {}
