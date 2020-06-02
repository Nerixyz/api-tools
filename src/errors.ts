export class BaseError extends Error {
  constructor(message?: string) {
    super(message);
    // @ts-ignore -- set the name to the class's actual name
    this.name = this.__proto__.constructor.name;
  }
}

export class RequestError extends BaseError {
  constructor(public statusCode: number, public errorMessage = 'Internal Error.') {
    super();
  }
}
