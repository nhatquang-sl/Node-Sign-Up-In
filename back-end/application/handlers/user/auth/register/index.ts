import { validateUserRegister } from '@libs/user/validate';
import { UserRegisterDto } from '@libs/user/dto';
import { delay } from '@application/common/utils';
import { BadRequestError, ConflictError } from '@application/common/exceptions';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
  Result,
} from '@application/mediator';

import { User, Role, UserRole, UserLoginHistory } from '@database';

export class UserRegisterCommand extends UserRegisterDto implements ICommand {
  ipAddress: string = '';
  userAgent: string = '';
}
console.log('=======================================================register');
@RegisterHandler
export class UserRegisterCommandHandler implements ICommandHandler<UserRegisterCommand, Result> {
  async handle(command: UserRegisterCommand): Promise<Result> {
    await delay(0);
  }
}

@RegisterValidator
export class UserRegisterCommandValidator implements ICommandValidator<UserRegisterCommand> {
  async validate(command: UserRegisterCommand): Promise<void> {
    const { firstNameError, lastNameError, emailAddressError, passwordError } =
      validateUserRegister(command);

    if (firstNameError || lastNameError || emailAddressError || passwordError.length) {
      const error = { firstNameError, lastNameError, emailAddressError };
      throw new BadRequestError(passwordError.length > 0 ? { ...error, passwordError } : error);
    }

    // Check for duplicate usernames in the db
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const duplicate = await User.findOne({
      where: { emailAddress: command.emailAddress },
      attributes: ['id'],
    });

    if (duplicate) throw new ConflictError({ emailAddressError: 'Duplicated email address' });
  }
}
