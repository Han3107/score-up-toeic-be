import { UserDto } from '../../users/dto/user.dto';

import { ConversationDto } from '../../conversations/dto/conversation.dto';

export class CreateMessageDto {
  isRead?: boolean;

  content?: string;

  sender?: UserDto;

  conversation?: ConversationDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
