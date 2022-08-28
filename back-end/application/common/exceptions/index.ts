import LANG from '@libs/lang';
export class NotFoundError extends Error {
  constructor(err: any = 'Not Found') {
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
  constructor(err: any | string = LANG.USER_ACCESS_TOKEN_INVALID_ERROR) {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}

export class ForbiddenError extends Error {
  constructor(err: any = 'Forbidden') {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}

export class ConflictError extends Error {
  constructor(err: any) {
    if (typeof err === 'string') super(JSON.stringify({ message: err }));
    else super(JSON.stringify(err));
  }
}
