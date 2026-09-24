import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderSchema, FolderSchemaClass } from './entities/folder.schema';
import { FolderRepository } from '../folder.repository';
import { FolderDocumentRepository } from './repositories/folder.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FolderSchemaClass.name, schema: FolderSchema },
    ]),
  ],
  providers: [
    {
      provide: FolderRepository,
      useClass: FolderDocumentRepository,
    },
  ],
  exports: [FolderRepository],
})
export class DocumentFolderPersistenceModule {}
