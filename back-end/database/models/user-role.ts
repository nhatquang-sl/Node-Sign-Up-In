import { DataTypes } from 'sequelize';
import User from './user';
import Role from './role';
import dbContext from '..';

const UserRole = dbContext.sequelize.define(
  'userRole',
  {
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: User, // 'users' would also work
        key: 'id',
      },
    },
    roleCode: {
      type: DataTypes.INTEGER,
      references: {
        model: Role, // 'Roles' would also work
        key: 'code',
      },
    },
  },
  { timestamps: false }
);
User.belongsToMany(Role, { through: UserRole, onDelete: 'CASCADE' });
Role.belongsToMany(User, { through: UserRole, onDelete: 'CASCADE' });

export default UserRole;
