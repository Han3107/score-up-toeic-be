import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Conversation } from './domain/conversation';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllConversationsDto } from './dto/find-all-conversations.dto';
import { Message } from '../messages/domain/message';
import type { RequestWithUser } from '../utils/types/request-with-user.type';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Conversation,
  })
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Conversation),
  })
  async findAll(
    @Request() request: RequestWithUser<JwtPayloadType>,
    @Query() query: FindAllConversationsDto,
  ): Promise<InfinityPaginationResponseDto<Conversation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.conversationsService.findByParticipantWithPagination(
        request.user?.id?.toString(),
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id/messages')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityPaginationResponse(Message),
  })
  async findMessages(
    @Request() request: RequestWithUser<JwtPayloadType>,
    @Param('id') id: string,
    @Query() query: FindAllConversationsDto,
  ): Promise<InfinityPaginationResponseDto<Message>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.conversationsService.findMessagesByConversation(
        id,
        request.user?.id?.toString(),
        {
          page,
          limit,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Conversation,
  })
  findById(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Conversation,
  })
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }
}
