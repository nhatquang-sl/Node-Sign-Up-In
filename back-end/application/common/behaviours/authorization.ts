import { AuthorizeCommand } from './../../../mediator/interfaces';
import jwt from 'jsonwebtoken';
import ENV from '@config';
import UserActivity from '@database/models/user-activity';
import { IMediatorMiddleware, ICommand, Result, container } from '../../../mediator';
import { UnauthorizedError } from '../exceptions';

export class AuthorizationBehavior implements IMediatorMiddleware {
  preProcess = async (request: ICommand) => {
    return new Promise<void>((resolve, reject) => {
      const cmdName = request.constructor.name;
      const handlerClass: any = container.handlers[`${cmdName}Handler`];
      if (handlerClass.prototype.authorizeRoles?.length === 0) return;
      const cmd = request as AuthorizeCommand;
      const accessToken = cmd.accessToken;
      console.log({
        authorizeRoles: handlerClass.prototype.authorizeRoles,
        accessToken,
      });
      jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        reject(new UnauthorizedError());
        // if (err) throw new UnauthorizedError();
      });
    });
  };
  postProcess = async (request: ICommand, result: Result) => {};
}

// const verifyJWT = (req: any, res: Response, next: NextFunction) => {
//   console.log(req.sessionId);
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
//   console.log(authHeader); // Bearer token
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
//     console.log({ err, decoded });
//     if (err) return res.sendStatus(401); // Invalid token
//     console.log({
//       sessionId: decoded.sessionId,
//       method: req.method,
//       originalUrl: req.originalUrl,
//       req,
//     });
//     req.headers.userId = decoded.userId;
//     const start = new Date().getTime();

//     // execute action
//     next();

//     const end = new Date().getTime() - start;
//     await UserActivity.create({
//       userId: decoded.userId,
//       sessionId: decoded.sessionId,
//       method: req.method,
//       path: req.originalUrl,
//       processed: end,
//     });
//   });
// };
