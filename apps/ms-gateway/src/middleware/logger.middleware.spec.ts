import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;

  const nextFunction = jest.fn();
  const request = {
    ip: '127.0.0.1',
    ips: ['127.0.0.1'],
    method: 'GET',
    originalUrl: '/',
    get: jest.fn().mockReturnValueOnce(''),
    headers: {}
  } as any;
  const response = {
    statusCode: 200,
    get: jest.fn().mockReturnValueOnce('0'),
    on: jest.fn().mockImplementationOnce((event, cb) => cb()),
    setHeader: jest.fn()
  } as any;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
    loggerMiddleware.use(request, response, nextFunction);
  });

  it('should be defined', () => {
    expect(loggerMiddleware).toBeDefined();
  });

  it('should call next middleware', () => {
    expect(nextFunction).toBeCalled();
  });

  it('should log request information on response close event', () => {
    const logSpy = jest.spyOn(loggerMiddleware['logger'], 'log');
    const nextFunction = jest.fn();

    const request = {
      ip: '127.0.0.1',
      ips: [],
      method: 'GET',
      originalUrl: '/',
      get: jest.fn().mockReturnValueOnce(''),
      headers: {}
    } as any;

    const response = {
      statusCode: 200,
      get: jest.fn().mockReturnValueOnce('0'),
      on: jest.fn().mockImplementationOnce((event, cb) => cb()),
      setHeader: jest.fn()
    } as any;

    loggerMiddleware.use(request, response, nextFunction);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET'),
      expect.stringContaining('HTTP')
    );
  });
});
