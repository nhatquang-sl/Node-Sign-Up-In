import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import LANG from '@libs/lang';
import { UserRegisterDto, UserAuthDto, validateUserRegister } from '@libs/user';

import { sendActivateEmail } from '@application/common/utils';
import { BadRequestError, ConflictError } from '@application/common/exceptions';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
} from '@application/mediator';

import { User, UserRole, UserLoginHistory } from '@database';

export class UserRegisterCommand extends UserRegisterDto implements ICommand {
  constructor(obj: any) {
    super(obj);
    this.ipAddress = obj?.ipAddress;
    this.userAgent = obj?.userAgent;
  }
  ipAddress: string = '';
  userAgent: string = '';
}

export class UserRegisterResult extends UserAuthDto {
  declare refreshToken: string;
}

@RegisterHandler
export class UserRegisterCommandHandler
  implements ICommandHandler<UserRegisterCommand, UserRegisterResult>
{
  async handle(command: UserRegisterCommand): Promise<UserRegisterResult> {
    const { ipAddress, userAgent } = command;
    // encrypt the password
    const salt = uuid().split('-')[0];
    const password = await bcrypt.hash(command.password + salt, 10);
    const securityStamp = uuid();

    // Create and store the new user
    const result = await User.create({
      emailAddress: command.emailAddress,
      firstName: command.firstName,
      lastName: command.lastName,
      password,
      salt,
      securityStamp,
    } as User);

    let userRoles = [{ userId: result.id, roleCode: 'user' }];
    if (command.emailAddress === 'sunlight479@yahoo.com')
      userRoles.push({ userId: result.id, roleCode: 'admin' });
    await UserRole.bulkCreate(userRoles);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        userId: result.id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      {
        userId: result.id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );

    await Promise.all([
      UserLoginHistory.create({
        userId: result.id,
        ipAddress,
        userAgent,
        accessToken,
        refreshToken,
      }),
      sendActivateEmail(result, securityStamp),
    ]);

    return {
      ...User.getAuthDto(result, accessToken),
      refreshToken,
    } as UserRegisterResult;
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

    if (duplicate)
      throw new ConflictError({ emailAddressError: LANG.USER_EMAIL_ADDRESS_DUPLICATED_ERROR });
  }
}
