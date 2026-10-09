import { UserDto } from '../../users/dto/user.dto';
import { ConversationDto } from '../../conversations/dto/conversation.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMessageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty({ type: () => UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  sender?: UserDto;

  @ApiProperty({ type: () => ConversationDto })
  @ValidateNested()
  @Type(() => ConversationDto)
  conversation?: ConversationDto;
}
