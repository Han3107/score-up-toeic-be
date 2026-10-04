import { Module } from '@nestjs/common';
import { LeaderboardsController } from './controllers/leaderboards.controller';
import { LeaderboardsService } from './services/leaderboards.service';
import { UsersModule } from '../users/users.module';

import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchemaClass,
  UserSchema,
} from '../users/infrastructure/persistence/document/entities/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
