import {
  CreationOptional,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import dbContext from '../db-context';
import User from './user';

// https://sequelize.org/docs/v6/other-topics/typescript/
class IBudgetStrategy extends Model<
  InferAttributes<IBudgetStrategy>,
  InferCreationAttributes<IBudgetStrategy>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: string;
  declare copyCode: string;
  declare copyFrom: number;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare deletedAt: CreationOptional<string>;
  declare userId: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
IBudgetStrategy.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      field: 'Id',
    },
    name: { type: DataTypes.STRING, field: 'Name', allowNull: false },
    type: { type: DataTypes.STRING, field: 'Type', allowNull: false },
    copyCode: { type: DataTypes.STRING, field: 'CopyCode' },
    copyFrom: { type: DataTypes.BIGINT, field: 'CopyFrom' },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    updatedAt: { type: DataTypes.DATE, field: 'UpdatedAt' },
    deletedAt: { type: DataTypes.DATE, field: 'DeletedAt' },
    userId: { type: DataTypes.BIGINT, field: 'UserId' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'BudgetStrategy', // We need to choose the model name
  }
);

User.hasMany(IBudgetStrategy);
IBudgetStrategy.belongsTo(User, { foreignKey: { name: 'UserId' } });

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default IBudgetStrategy;
