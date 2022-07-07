import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class UserLoginHistory extends Model<
  InferAttributes<UserLoginHistory>,
  InferCreationAttributes<UserLoginHistory>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare ipAddress: string;
  declare userAgent: string | null;
  declare accessToken: string | null;
  declare refreshToken: string | null;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
UserLoginHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false, // allowNull defaults to true
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.STRING,
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'userLoginHistory', // We need to choose the model name
    updatedAt: false,
  }
);

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default UserLoginHistory;
