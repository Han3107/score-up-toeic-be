import { UsersModule } from '../users/users.module';
import { ConversationsModule } from '../conversations/conversations.module';
import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DocumentMessagePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    UsersModule,

    forwardRef(() => ConversationsModule),

    // do not remove this comment
    DocumentMessagePersistenceModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService, DocumentMessagePersistenceModule],
})
export class MessagesModule {}
