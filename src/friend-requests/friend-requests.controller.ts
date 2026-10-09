import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FriendRequest } from './domain/friend-request';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('FriendRequests')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'friends',
  version: '1',
})
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('request')
  @ApiOkResponse({
    type: FriendRequest,
  })
  createRequest(
    @Request() request: any,
    @Body('receiverId') receiverId: string,
  ) {
    return this.friendRequestsService.createRequest(
      request.user?.id,
      receiverId,
    );
  }

  @Patch('request/:id/accept')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FriendRequest,
  })
  accept(@Param('id') id: string, @Request() request: any) {
    return this.friendRequestsService.accept(id, request.user?.id);
  }

  @Patch('request/:id/decline')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FriendRequest,
  })
  decline(@Param('id') id: string, @Request() request: any) {
    return this.friendRequestsService.decline(id, request.user?.id);
  }

  @Get('requests')
  @ApiOkResponse({
    type: [FriendRequest],
  })
  getPendingRequests(@Request() request: any) {
    return this.friendRequestsService.getPendingRequests(request.user?.id);
  }

  @Get()
  @ApiOkResponse({
    type: [FriendRequest], // Maybe return Users later, but let's stick to what's simple or friend requests that are accepted
  })
  getFriends(@Request() request: any) {
    return this.friendRequestsService.getFriends(request.user?.id);
  }
}
