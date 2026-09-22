import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySchema,
  CategorySchemaClass,
} from '../../../../categories/infrastructure/persistence/document/entities/category.schema';
import { CategorySeedService } from './category-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategorySchemaClass.name,
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [CategorySeedService],
  exports: [CategorySeedService],
})
export class CategorySeedModule {}
