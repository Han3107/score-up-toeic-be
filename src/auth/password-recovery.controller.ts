import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordRecoveryConfirmDto } from './dto/password-recovery-confirm.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/password-recovery',
  version: '1',
})
export class PasswordRecoveryController {
  constructor(private readonly service: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async forgotPassword(
    @Body() forgotPasswordDto: PasswordRecoveryDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  public resetPassword(
    @Body() resetPasswordDto: PasswordRecoveryConfirmDto,
  ): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }
}
