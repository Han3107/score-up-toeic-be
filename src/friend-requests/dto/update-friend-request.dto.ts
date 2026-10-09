// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateFriendRequestDto } from './create-friend-request.dto';

export class UpdateFriendRequestDto extends PartialType(
  CreateFriendRequestDto,
) {}
