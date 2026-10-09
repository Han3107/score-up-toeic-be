import { Message } from '../../messages/domain/message';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Conversation {
  @ApiProperty({
    type: () => Message,
    nullable: true,
  })
  lastMessage?: Message;

  @ApiProperty({
    type: () => [User],
    nullable: false,
  })
  participants?: User[];

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
