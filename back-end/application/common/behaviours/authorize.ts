import { AuthorizeCommand } from '../../mediator/interfaces';
import jwt from 'jsonwebtoken';
import ENV from '@config';
import { ICommand, container, IPipelineBehavior } from '@application/mediator';
import { UnauthorizedError, ForbiddenError } from '../exceptions';

export class AuthorizeBehavior implements IPipelineBehavior {
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    if (request instanceof AuthorizeCommand) await this.verifyToken(request);

    return await next();
  };
  verifyToken = async (request: AuthorizeCommand) => {
    return new Promise<any>((resolve, reject) => {
      const cmdName = request.constructor.name;
      const handlerClass: any = container.handlers[`${cmdName}Handler`];

      const accessToken = request.accessToken;
      const requiredRoles = handlerClass.prototype.authorizeRoles;

      jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) reject(new UnauthorizedError());
        if (
          requiredRoles?.length &&
          !requiredRoles.filter((r: string) => decoded.roles.includes(r)).length
        ) {
          reject(new ForbiddenError());
        }
        console.log({ decoded });
        request.userId = decoded.userId;
        resolve(decoded);
      });
    });
  };
}
