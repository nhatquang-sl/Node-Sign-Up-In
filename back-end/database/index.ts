import User from '@database/models/user';
import UserForgotPassword from '@database/models/user-forgot-password';
import Role from '@database/models/role';
import UserRole from '@database/models/user-role';
import dbContext from './db-context';

const initializeDb = async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  // await UserRole.drop();
  // await UserForgotPassword.drop();
  await dbContext.sequelize.sync({ force: true });
  // await UserRole.sync({ force: true });
  const roles = await Role.findAll();
  if (!roles.length) {
    Role.bulkCreate([
      { code: 'admin', name: 'Admin' },
      { code: 'support', name: 'Support' },
      { code: 'user', name: 'User' },
    ]);
  }
};
export { User, UserForgotPassword, UserRole, Role, dbContext, initializeDb };
