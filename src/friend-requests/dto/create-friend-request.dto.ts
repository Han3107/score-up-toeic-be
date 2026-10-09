import { UserDto } from '../../users/dto/user.dto';

export class CreateFriendRequestDto {
  status?: string;

  receiver?: UserDto;

  sender?: UserDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
