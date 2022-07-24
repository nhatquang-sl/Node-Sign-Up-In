import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import User from './user';
import dbContext from '../db-context';
import { UserForgotPasswordDto } from '@libs/user/dto';

// https://sequelize.org/docs/v6/other-topics/typescript/
class UserForgotPassword
  extends Model<InferAttributes<UserForgotPassword>, InferCreationAttributes<UserForgotPassword>>
  implements UserForgotPasswordDto
{
  declare id: CreationOptional<number>;
  declare userId: number;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare password: string | null;
  declare salt: string;
  declare token: string;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

UserForgotPassword.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: User, // 'users' would also work
        key: 'id',
      },
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    salt: { type: DataTypes.STRING(8), allowNull: false },
    token: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'UserForgotPassword', // We need to choose the model name
  }
);

// https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-one-relationships
User.hasOne(UserForgotPassword, { onDelete: 'CASCADE' });
UserForgotPassword.belongsTo(User, { onDelete: 'CASCADE' });

export default UserForgotPassword;
