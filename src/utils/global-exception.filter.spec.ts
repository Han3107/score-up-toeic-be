import { GlobalExceptionFilter } from './global-exception.filter';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    logger.error = jest.fn();
    filter = new GlobalExceptionFilter(logger);
  });

  it('should log the exception and return formatted response', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({
      status: mockStatus,
    });
    const mockGetRequest = jest.fn().mockReturnValue({
      url: '/test',
      method: 'GET',
      id: 'test-req-id',
    });

    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
    } as any;

    const exception = new HttpException('Test Error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(logger.error).toHaveBeenCalled();
    const logArgs = (logger.error as jest.Mock).mock.calls[0];
    expect(logArgs[0]).toContain('Test Error');
    expect(logArgs[1]).toBeDefined(); // stack trace

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test Error',
        path: '/test',
      }),
    );
  });
});
