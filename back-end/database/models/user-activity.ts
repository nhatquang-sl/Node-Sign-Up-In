import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import dbContext from '..';

// https://sequelize.org/docs/v6/other-topics/typescript/
class UserActivity extends Model<
  InferAttributes<UserActivity>,
  InferCreationAttributes<UserActivity>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare sessionId: number;
  declare method: string;
  declare path: string;
  declare processed: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
UserActivity.init(
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
    sessionId: {
      type: DataTypes.BIGINT,
      allowNull: false, // allowNull defaults to true
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false, // allowNull defaults to true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false, // allowNull defaults to true
    },
    processed: {
      type: DataTypes.INTEGER,
      allowNull: false, // allowNull defaults to true
      defaultValue: 0,
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'userActivity', // We need to choose the model name
    updatedAt: false,
  }
);

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default UserActivity;
