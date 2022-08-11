import { AuthorizeCommand } from '../../mediator/interfaces';
import jwt from 'jsonwebtoken';
import ENV from '@config';
import UserActivity from '@database/models/user-activity';
import { ICommand, Result, container, IPipelineBehavior } from '@application/mediator';
import { UnauthorizedError } from '../exceptions';

export class AuthorizeBehavior implements IPipelineBehavior {
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    await this.verifyToken(request);
    return await next();
  };
  verifyToken = async (request: ICommand) => {
    return new Promise<any>((resolve, reject) => {
      const cmdName = request.constructor.name;
      const handlerClass: any = container.handlers[`${cmdName}Handler`];

      const cmd = request as AuthorizeCommand;
      const accessToken = cmd.accessToken;
      const requiredRoles = handlerClass.prototype.authorizeRoles;

      jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) reject(new UnauthorizedError());
        if (
          requiredRoles?.length &&
          !requiredRoles.filter((r: string) => decoded.roles.includes(r)).length
        ) {
          reject(new UnauthorizedError());
        }
        console.log({ decoded });
        resolve(decoded);
      });
    });
  };
}
