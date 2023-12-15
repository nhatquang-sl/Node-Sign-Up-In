import jwt, { TokenExpiredError } from 'jsonwebtoken';
import ENV from '@config';
import {
  ICommand,
  container,
  IPipelineBehavior,
  AuthorizeCommand,
  UnauthorizedError,
  ForbiddenError,
} from '@qnn92/mediatorts';

export class AuthorizeBehavior implements IPipelineBehavior {
  handle = async (command: ICommand, next: () => Promise<any>): Promise<any> => {
    if (command instanceof AuthorizeCommand) await this.verifyToken(command);

    return await next();
  };
  verifyToken = async (command: AuthorizeCommand) => {
    return new Promise<any>((resolve, reject) => {
      const cmdName = command.constructor.name;
      const handlerClass: any = container.handlers[`${cmdName}Handler`];

      const accessToken = command.accessToken;
      const requiredRoles = handlerClass.prototype.authorizeRoles;

      jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err instanceof TokenExpiredError) reject(new UnauthorizedError('Access Token Expired'));
        if (err) reject(new UnauthorizedError());
        if (
          requiredRoles?.length &&
          !requiredRoles.filter((r: string) => decoded.roles.includes(r)).length
        ) {
          reject(new ForbiddenError('Insufficient Scope'));
        }

        command.userId = decoded.id;
        command.accessTokenType = decoded.type;
        resolve(decoded);
      });
    });
  };
}
