import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class FriendRequest {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status?: string;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  receiver?: User;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  sender?: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
