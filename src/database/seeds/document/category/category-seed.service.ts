import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategorySchemaClass } from '../../../../categories/infrastructure/persistence/document/entities/category.schema';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly model: Model<CategorySchemaClass>,
  ) {}

  async run() {
    const defaultCategories = [
      {
        name: 'Word Form',
        description: 'Questions focusing on correct word forms',
        status: 'ACTIVE',
        sequence: 1,
      },
      {
        name: 'Grammar',
        description: 'General grammar rules and structures',
        status: 'ACTIVE',
        sequence: 2,
      },
      {
        name: 'Passive Voice',
        description: 'Active and passive voice transformations',
        status: 'ACTIVE',
        sequence: 3,
      },
      {
        name: 'Word Endings',
        description: 'Suffixes and word endings recognition',
        status: 'ACTIVE',
        sequence: 4,
      },
      {
        name: 'Vocabulary',
        description: 'Common TOEIC vocabulary and meanings',
        status: 'ACTIVE',
        sequence: 5,
      },
      {
        name: 'Reading',
        description: 'Reading comprehension exercises',
        status: 'ACTIVE',
        sequence: 6,
      },
    ];

    for (const cat of defaultCategories) {
      const count = await this.model.countDocuments({ name: cat.name });
      if (count === 0) {
        const data = new this.model(cat);
        await data.save();
      }
    }
  }
}
