import { Module } from '@nestjs/common';
import { ExamsService } from './services/exams.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
