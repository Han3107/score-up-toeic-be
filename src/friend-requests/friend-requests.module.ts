import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { DocumentFriendRequestPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    DocumentFriendRequestPersistenceModule,
  ],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports: [FriendRequestsService, DocumentFriendRequestPersistenceModule],
})
export class FriendRequestsModule {}
