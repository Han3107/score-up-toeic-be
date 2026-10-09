import { UserDto } from '../../users/dto/user.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFriendRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ type: () => UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  receiver?: UserDto;

  @ApiProperty({ type: () => UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  sender?: UserDto;
}
