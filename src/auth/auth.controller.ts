import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import type { RequestWithUser } from '../utils/types/request-with-user.type';
import type { JwtPayloadType } from './strategies/types/jwt-payload.type';
import type { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    return this.service.validateLogin(loginDto);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<void> {
    return this.service.register(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @Request() request: RequestWithUser<JwtRefreshPayloadType>,
  ): Promise<RefreshResponseDto> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @Request() request: RequestWithUser<JwtPayloadType>,
  ): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }
}
