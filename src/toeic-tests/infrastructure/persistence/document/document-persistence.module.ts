import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ToeicTestSchema,
  ToeicTestSchemaClass,
} from './entities/toeic-test.schema';
import { ToeicTestRepository } from '../toeic-test.repository';
import { ToeicTestDocumentRepository } from './repositories/toeic-test.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ToeicTestSchemaClass.name, schema: ToeicTestSchema },
    ]),
  ],
  providers: [
    {
      provide: ToeicTestRepository,
      useClass: ToeicTestDocumentRepository,
    },
  ],
  exports: [ToeicTestRepository],
})
export class DocumentToeicTestPersistenceModule {}
