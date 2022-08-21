import { dbContext, initializeDb, User } from '@database';
import { BadRequestError, ConflictError } from '@application/common/exceptions';
import { mediator } from '@application/mediator';
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
  await rejects.toThrow(
    JSON.stringify({ firstNameError: 'First name must be at least 2 characters' })
  );
});

test('last name missing', async () => {
  let command = new UserRegisterCommand(user);
  command.lastName = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ lastNameError: 'Last name must be at least 2 characters' })
  );
});

test('email address missing', async () => {
  let command = new UserRegisterCommand(user);
  command.emailAddress = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Email address is invalid' }));
});

test('password missing', async () => {
  let command = new UserRegisterCommand(user);
  command.password = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({
      passwordError: [
        'Password contains at least one lower character',
        'Password contains at least one upper character',
        'Password contains at least one digit character',
        'Password contains at least one special character',
        'Password contains at least 8 characters',
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
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Duplicated email address' }));
});
