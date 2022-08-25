import User from '@database/models/user';
import UserForgotPassword from '@database/models/user-forgot-password';
import Role from '@database/models/role';
import UserRole from '@database/models/user-role';
import dbContext from './db-context';
import UserLoginHistory from '@database/models/user-login-history';
import UserActivity from './models/user-activity';
import IPlan from '@database/models/i-plan';
import ISignalSource from './models/i-signal-source';
import ISignalStrategy from './models/i-signal-strategy';
import ISignalStrategySource from './models/i-signal-strategy-source';

const initializeDb = async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  // await UserRole.drop();
  // await UserForgotPassword.drop();

  await dbContext.sequelize.drop();
  await dbContext.sequelize.sync({ force: true });

  const roles = await Role.findAll();
  if (!roles.length) {
    Role.bulkCreate([
      { code: 'admin', name: 'Admin' },
      { code: 'support', name: 'Support' },
      { code: 'user', name: 'User' },
    ]);
  }
};
export {
  User,
  UserLoginHistory,
  UserForgotPassword,
  UserActivity,
  Role,
  UserRole,
  IPlan as IPPlan,
  ISignalSource as IPSignalSource,
  ISignalStrategy as IPSignalStrategy,
  ISignalStrategySource as IPSignalStrategySource,
  dbContext,
  initializeDb,
};
