import dbContext from './db-context';
import User from '@database/models/user';
import UserForgotPassword from '@database/models/user-forgot-password';
import Role from '@database/models/role';
import UserRole from '@database/models/user-role';
import UserLoginHistory from '@database/models/user-login-history';
import GridPlan from '@database/models/grid-plan';

const initializeDb = async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  try {
    // await UserRole.drop();
    // await UserForgotPassword.drop();
    // await dbContext.sequelize.sync({ force: true });
    await GridPlan.sync({ force: true });
  } catch (err) {
    console.log({ err });
  }
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
  dbContext,
  initializeDb,
  User,
  UserLoginHistory,
  UserForgotPassword,
  Role,
  UserRole,
  GridPlan,
};
