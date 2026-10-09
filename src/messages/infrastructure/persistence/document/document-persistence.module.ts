import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema, MessageSchemaClass } from './entities/message.schema';
import { MessageRepository } from '../message.repository';
import { MessageDocumentRepository } from './repositories/message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageSchemaClass.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    {
      provide: MessageRepository,
      useClass: MessageDocumentRepository,
    },
  ],
  exports: [MessageRepository],
})
export class DocumentMessagePersistenceModule {}
