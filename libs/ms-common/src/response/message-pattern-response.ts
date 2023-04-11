export interface IBaseResponse {
  error?: boolean | false;
  status?: number | 200;
  errorCodes?: string[] | [];
  errorMessages?: string[] | [];
}

export default class MessagePatternResponse {
  private status = 200;
  private errorCodes = [];
  private errorMessages = [];

  constructor(options?: IBaseResponse) {
    const { status, errorCodes, errorMessages } = options || {};
    this.status = status || this.status;
    this.errorCodes = errorCodes || this.errorCodes;
    this.errorMessages = errorMessages || this.errorMessages;
  }

  setStatus(status: number) {
    this.status = status;
    return this;
  }

  sendErrors<T>(errors: string[]) {
    return {
      error: true,
      status: this.status,
      errorMessages: errors
    } as T;
  }

  send<T>(data: any) {
    return {
      error: false,
      status: this.status,
      data: data
    } as T;
  }
}
