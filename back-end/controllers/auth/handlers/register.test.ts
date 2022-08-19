import bcrypt from 'bcrypt';
import { dbContext, initializeDb, User, UserLoginHistory, Role } from '@database';
import { BadRequestError, ConflictError } from '@application/common/exceptions';
import handleRegister from './register';

const user = {
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();
});

test('missing first name', async () => {
  const invalidUser = { ...user, firstName: '' };
  const rejects = expect(handleRegister(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ firstNameError: 'First name must be at least 2 characters' })
  );
});

test('missing last name', async () => {
  const invalidUser = { ...user, lastName: '' };
  const rejects = expect(handleRegister(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({ lastNameError: 'Last name must be at least 2 characters' })
  );
});

test('missing email address', async () => {
  const invalidUser = { ...user, emailAddress: '' };
  const rejects = expect(handleRegister(invalidUser)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Email address is invalid' }));
});

test('missing password', async () => {
  const invalidUser = { ...user, password: '' };
  const rejects = expect(handleRegister(invalidUser)).rejects;
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

test('create a new user success', async () => {
  const regUser = await handleRegister(user);
  const { id, firstName, lastName, emailAddress, emailConfirmed } = regUser;

  expect(id).toBe(1);
  expect(firstName).toBe(user.firstName);
  expect(lastName).toBe(user.lastName);
  expect(emailAddress).toBe(user.emailAddress);
  expect(emailConfirmed).toBe(false);

  await Promise.all([validateUser(regUser), validateTokens(regUser)]);
});

test('conflict email address', async () => {
  const rejects = expect(handleRegister(user)).rejects;
  await rejects.toThrow(ConflictError);
  await rejects.toThrow(JSON.stringify({ emailAddressError: 'Duplicated email address!' }));
});

const validateUser = async (regUser: any) => {
  const { id, firstName, lastName, emailAddress, emailConfirmed } = regUser;

  const creUser = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        attributes: ['code'],
        through: {
          attributes: [],
        },
      },
    ],
  });

  const match = await bcrypt.compare(user.password + creUser?.salt, creUser?.password ?? '');
  expect(creUser).not.toBeNull();
  expect(match).toBe(true);
  expect(creUser?.firstName).toBe(firstName);
  expect(creUser?.lastName).toBe(lastName);
  expect(creUser?.emailAddress).toBe(emailAddress);
  expect(creUser?.emailConfirmed).toBe(emailConfirmed);
  expect(creUser?.securityStamp).not.toBeNull();

  // validate roles
  expect(creUser?.roles?.map((r) => r.code).length).toBe(1);
  expect(creUser?.roles?.map((r) => r.code)[0]).toBe('user');
};

// validate tokens in database
const validateTokens = async (regUser: any) => {
  const { id, accessToken, refreshToken } = regUser;
  const lhUser = await UserLoginHistory.findOne({ where: { userId: id } });
  expect(lhUser?.accessToken).toBe(accessToken);
  expect(lhUser?.refreshToken).toBe(refreshToken);

  // TODO: need to decode and validate access and refresh tokens.
};
