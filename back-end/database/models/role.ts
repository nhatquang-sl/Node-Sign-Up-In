import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare code: string;
  declare name: string;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
Role.init(
  {
    code: { type: DataTypes.STRING, primaryKey: true, field: 'Code', allowNull: false },
    name: { type: DataTypes.STRING, field: 'Name', allowNull: false },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'Role', // We need to choose the model name
    timestamps: false, //https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
  }
);

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default Role;
