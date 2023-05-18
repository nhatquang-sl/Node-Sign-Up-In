import LANG from '@libs/lang';
import { dbContext, initializeDb, User } from '@database';
import { mediator, BadRequestError, ConflictError } from '@qnn92/mediatorts';
import { UserRegisterCommand } from '.';

const user = {
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
};

test('first name missing', async () => {
  let command = new UserRegisterCommand(user);
  command.firstName = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ firstNameError: LANG.USER_FIRST_NAME_ERROR }));
});

test('last name missing', async () => {
  let command = new UserRegisterCommand(user);
  command.lastName = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ lastNameError: LANG.USER_LAST_NAME_ERROR }));
});

test('email address missing', async () => {
  let command = new UserRegisterCommand(user);
  command.emailAddress = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ emailAddressError: LANG.USER_EMAIL_ADDRESS_INVALID_ERROR })
  );
});

test('password missing', async () => {
  let command = new UserRegisterCommand(user);
  command.password = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({
      passwordError: [
        LANG.USER_PASSWORD_LOWER_CHAR_ERROR,
        LANG.USER_PASSWORD_UPPER_CHAR_ERROR,
        LANG.USER_PASSWORD_DIGIT_CHAR_ERROR,
        LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR,
        LANG.USER_PASSWORD_LENGTH_ERROR,
      ],
    })
  );
});

test('email address conflict', async () => {
  await dbContext.connect();
  await initializeDb();
  await User.create({
    emailAddress: user.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    salt: 'salt',
    securityStamp: 'securityStamp',
  } as User);

  let validUser = new UserRegisterCommand(user);

  const rejects = expect(mediator.send(validUser)).rejects;
  await rejects.toThrow(ConflictError);
  await rejects.toThrow(
    JSON.stringify({ emailAddressError: LANG.USER_EMAIL_ADDRESS_DUPLICATED_ERROR })
  );
});
