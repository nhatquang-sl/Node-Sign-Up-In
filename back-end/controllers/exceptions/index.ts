export class NotFoundError extends Error {
  constructor(err: any) {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}

export class BadRequestError extends Error {
  constructor(err: any) {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}

export class UnauthorizedError extends Error {
  constructor(err: any | string = 'Invalid Token') {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}
