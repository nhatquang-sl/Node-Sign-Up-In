import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
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

// class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
//   declare userId: number;
//   declare roleCode: string;
// }

// // https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
// UserRole.init(
//   {
//     userId: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//       references: {
//         model: User,
//         key: 'id',
//       },
//     },
//     roleCode: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       references: {
//         model: Role,
//         key: 'code',
//       },
//     },
//   },
//   {
//     // Other model options go here
//     sequelize: dbContext.sequelize, // We need to pass the connection instance
//     modelName: 'UserRole', // We need to choose the model name
//     timestamps: false, //https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
//   }
// );

// Role.belongsToMany(User, { through: UserRole });
// User.belongsToMany(Role, { through: UserRole });

export default UserRole;
