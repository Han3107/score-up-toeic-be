import { Module, forwardRef } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

const infrastructurePersistenceModule = DocumentUserPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
