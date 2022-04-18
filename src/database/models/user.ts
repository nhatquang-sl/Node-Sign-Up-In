import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';
import dbContext from '..';

// https://sequelize.org/docs/v6/other-topics/typescript/
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare emailAddress: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare refreshToken?: string;
  declare securityStamp: string;
  declare emailConfirmed: boolean | false;
}

// class User extends Model {}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    emailAddress: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false // allowNull defaults to true
    },
    lastName: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    securityStamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  }
);

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true
export default User;
