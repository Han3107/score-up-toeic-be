import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSchema,
  ConversationSchemaClass,
} from './entities/conversation.schema';
import { ConversationRepository } from '../conversation.repository';
import { ConversationDocumentRepository } from './repositories/conversation.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationSchemaClass.name, schema: ConversationSchema },
    ]),
  ],
  providers: [
    {
      provide: ConversationRepository,
      useClass: ConversationDocumentRepository,
    },
  ],
  exports: [ConversationRepository],
})
export class DocumentConversationPersistenceModule {}
