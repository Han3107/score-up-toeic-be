import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamResultsService } from './exam-results.service';
import { CreateExamResultDto } from './dto/create-exam-result.dto';

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'exam-results',
  version: '1',
})
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() createDto: CreateExamResultDto) {
    return this.examResultsService.create(req.user.id, createDto);
  }
}
