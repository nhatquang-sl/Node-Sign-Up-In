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
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare password: string | null;
  declare salt: string;
  declare token: string;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare userId: number;
}

UserForgotPassword.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: 'Id' },
    ipAddress: { type: DataTypes.STRING, field: 'IpAddress' },
    userAgent: { type: DataTypes.STRING, field: 'UserAgent' },
    password: { type: DataTypes.STRING, field: 'Password' },
    salt: { type: DataTypes.STRING(8), field: 'EmailAddress', allowNull: false },
    token: { type: DataTypes.STRING, field: 'Token', allowNull: false },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    updatedAt: { type: DataTypes.DATE, field: 'UpdatedAt' },
    userId: { type: DataTypes.BIGINT, field: 'UserId' },
  },
  {
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'UserForgotPassword', // We need to choose the model name
  }
);

// https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-one-relationships
User.hasMany(UserForgotPassword);
UserForgotPassword.belongsTo(User, { foreignKey: { name: 'UserId' } });

export default UserForgotPassword;
