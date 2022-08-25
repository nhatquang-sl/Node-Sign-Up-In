import bcrypt from 'bcrypt';
import { dbContext, initializeDb, User, UserLoginHistory, Role } from '@database';
import { mediator } from '@application/mediator';
import { UserRegisterCommand, UserRegisterResult } from '.';

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

test('create a new user success', async () => {
  const command = new UserRegisterCommand({
    ...user,
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
  });
  const regUser = (await mediator.send(command)) as UserRegisterResult;

  const { id, firstName, lastName, emailAddress, emailConfirmed } = regUser;

  expect(id).toBe(1);
  expect(firstName).toBe(user.firstName);
  expect(lastName).toBe(user.lastName);
  expect(emailAddress).toBe(user.emailAddress);
  expect(emailConfirmed).toBe(false);

  await Promise.all([validateUser(regUser), validateTokens(regUser)]);
});

const validateUser = async (regUser: UserRegisterResult) => {
  const { id, firstName, lastName, emailAddress, emailConfirmed } = regUser;

  const creUser = await User.findOne({
    where: { id },
    include: [
      {
        model: Role,
        as: 'roles',
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
const validateTokens = async (regUser: UserRegisterResult) => {
  const { id, accessToken, refreshToken } = regUser;
  const lhUser = await UserLoginHistory.findOne({ where: { userId: id } });
  expect(lhUser?.accessToken).toBe(accessToken);
  expect(lhUser?.refreshToken).toBe(refreshToken);
  expect(lhUser?.ipAddress).toBe('ipAddress');
  expect(lhUser?.userAgent).toBe('userAgent');

  // TODO: need to decode and validate access and refresh tokens.
};
