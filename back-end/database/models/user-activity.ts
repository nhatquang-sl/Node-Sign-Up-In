import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import User from './user';
import UserLoginHistory from './user-login-history';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class UserActivity extends Model<
  InferAttributes<UserActivity>,
  InferCreationAttributes<UserActivity>
> {
  declare id: CreationOptional<number>;
  declare method: string;
  declare path: string;
  declare processed: number;
  declare createdAt: CreationOptional<string>;
  declare userId: number;
  declare userLoginHistoryId: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
UserActivity.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: 'Id' },
    method: { type: DataTypes.STRING, field: 'Method', allowNull: false },
    path: { type: DataTypes.STRING, field: 'Path', allowNull: false },
    processed: { type: DataTypes.INTEGER, field: 'Processed', allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    userId: { type: DataTypes.BIGINT, field: 'UserId' },
    userLoginHistoryId: { type: DataTypes.BIGINT, field: 'UserLoginHistoryId' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'UserActivity', // We need to choose the model name
    updatedAt: false,
  }
);

User.hasMany(UserActivity);
UserActivity.belongsTo(User, { foreignKey: { name: 'UserId' } });

UserLoginHistory.hasMany(UserActivity);
UserActivity.belongsTo(UserLoginHistory, { foreignKey: { name: 'UserLoginHistoryId' } });

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default UserActivity;
