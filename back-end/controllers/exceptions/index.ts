export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Invalid Token') {
    super(message);
  }
}
