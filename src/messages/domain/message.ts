import { User } from '../../users/domain/user';
import { Conversation } from '../../conversations/domain/conversation';
import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isRead?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  content?: string;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  sender?: User;

  @ApiProperty({
    type: () => Conversation,
    nullable: false,
  })
  conversation?: Conversation;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
