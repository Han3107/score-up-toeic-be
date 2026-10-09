import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { DocumentConversationPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    forwardRef(() => MessagesModule),

    UsersModule,

    // do not remove this comment
    DocumentConversationPersistenceModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService, DocumentConversationPersistenceModule],
})
export class ConversationsModule {}
