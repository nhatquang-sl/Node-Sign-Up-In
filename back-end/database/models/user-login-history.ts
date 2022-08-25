import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import dbContext from '../db-context';
import User from './user';

// https://sequelize.org/docs/v6/other-topics/typescript/
class UserLoginHistory extends Model<
  InferAttributes<UserLoginHistory>,
  InferCreationAttributes<UserLoginHistory>
> {
  declare id: CreationOptional<number>;
  declare ipAddress: string;
  declare userAgent: string | null;
  declare accessToken: string | null;
  declare refreshToken: string | null;
  declare createdAt: CreationOptional<string>;
  declare userId: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
UserLoginHistory.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: 'Id' },
    ipAddress: { type: DataTypes.STRING, field: 'IpAddress' },
    userAgent: { type: DataTypes.STRING, field: 'UserAgent' },
    accessToken: { type: DataTypes.STRING, field: 'AccessToken' },
    refreshToken: { type: DataTypes.STRING, field: 'RefreshToken' },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    userId: { type: DataTypes.BIGINT, field: 'UserId' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'UserLoginHistory', // We need to choose the model name
    updatedAt: false,
  }
);

User.hasMany(UserLoginHistory);
UserLoginHistory.belongsTo(User, { foreignKey: { name: 'UserId' } });
// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default UserLoginHistory;
