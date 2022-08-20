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

test('missing first name', async () => {
  let invalidUser = new UserRegisterCommand();
  invalidUser.emailAddress = user.emailAddress;
  invalidUser.lastName = user.lastName;
  invalidUser.password = user.password;

  const rejects = expect(mediator.send(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ firstNameError: 'First name must be at least 2 characters' })
  );
});

test('missing last name', async () => {
  let invalidUser = new UserRegisterCommand();
  invalidUser.emailAddress = user.emailAddress;
  invalidUser.firstName = user.firstName;
  invalidUser.password = user.password;

  const rejects = expect(mediator.send(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ lastNameError: 'Last name must be at least 2 characters' })
  );
});

test('missing email address', async () => {
  let invalidUser = new UserRegisterCommand();
  invalidUser.password = user.password;
  invalidUser.firstName = user.firstName;
  invalidUser.lastName = user.lastName;

  const rejects = expect(mediator.send(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Email address is invalid' }));
});

test('missing password', async () => {
  let invalidUser = new UserRegisterCommand();
  invalidUser.emailAddress = user.emailAddress;
  invalidUser.firstName = user.firstName;
  invalidUser.lastName = user.lastName;

  const rejects = expect(mediator.send(invalidUser)).rejects;
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

test('conflict email address', async () => {
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

  let validUser = new UserRegisterCommand();
  validUser.emailAddress = user.emailAddress;
  validUser.firstName = user.firstName;
  validUser.lastName = user.lastName;
  validUser.password = user.password;

  const rejects = expect(mediator.send(validUser)).rejects;
  await rejects.toThrow(ConflictError);
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Duplicated email address' }));
});
