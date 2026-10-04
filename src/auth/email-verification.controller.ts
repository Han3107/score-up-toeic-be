import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailVerificationConfirmDto } from './dto/email-verification-confirm.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/email-verification',
  version: '1',
})
export class EmailVerificationController {
  constructor(private readonly service: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmEmail(
    @Body() confirmEmailDto: EmailVerificationConfirmDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmNewEmail(
    @Body() confirmEmailDto: EmailVerificationConfirmDto,
  ): Promise<void> {
    return this.service.confirmNewEmail(confirmEmailDto.hash);
  }
}
