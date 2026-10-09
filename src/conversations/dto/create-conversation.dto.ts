import { MessageDto } from '../../messages/dto/message.dto';

import { UserDto } from '../../users/dto/user.dto';

export class CreateConversationDto {
  lastMessage?: MessageDto;

  participants?: UserDto[];

  // Don't forget to use the class-validator decorators in the DTO properties.
}
