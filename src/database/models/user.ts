import { DataTypes, Model } from 'sequelize';
import dbContext from '..';

class User extends Model {}

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
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  }
);

// https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
// User.sync();
// User.sync({ force: true });

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true
export default User;
