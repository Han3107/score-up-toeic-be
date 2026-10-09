import { MessageDto } from '../../messages/dto/message.dto';
import { UserDto } from '../../users/dto/user.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @ApiPropertyOptional({ type: () => MessageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MessageDto)
  lastMessage?: MessageDto;

  @ApiProperty({ type: () => [UserDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  participants?: UserDto[];
}
