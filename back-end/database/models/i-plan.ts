import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import dbContext from '../db-context';
import User from './user';
import ISignalStrategy from './i-signal-strategy';
import IBudgetStrategy from './i-budget-strategy';

// https://sequelize.org/docs/v6/other-topics/typescript/
class IPlan extends Model<InferAttributes<IPlan>, InferCreationAttributes<IPlan>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: string;
  declare budget: number;
  declare takeProfit: number;
  declare stopLoss: number;
  declare expertMode: boolean;
  declare sendSignal: boolean;
  declare copyCode: string;
  declare copyFrom: number;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare deletedAt: CreationOptional<string>;
  declare userId: number;
  declare signalStrategyId: number;
  declare budgetStrategyId: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
IPlan.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      field: 'Id',
    },
    name: { type: DataTypes.STRING, field: 'Name', allowNull: false },
    type: { type: DataTypes.STRING, field: 'Type', allowNull: false },
    budget: { type: DataTypes.DECIMAL, field: 'Budget', allowNull: false },
    takeProfit: { type: DataTypes.DECIMAL, field: 'TakeProfit', allowNull: false },
    stopLoss: { type: DataTypes.DECIMAL, field: 'StopLoss', allowNull: false },
    expertMode: { type: DataTypes.BOOLEAN, field: 'ExpertMode', allowNull: false },
    sendSignal: { type: DataTypes.BOOLEAN, field: 'SendSignal', allowNull: false },
    copyCode: { type: DataTypes.STRING, field: 'CopyCode' },
    copyFrom: { type: DataTypes.BIGINT, field: 'CopyFrom' },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    updatedAt: { type: DataTypes.DATE, field: 'UpdatedAt' },
    deletedAt: { type: DataTypes.DATE, field: 'DeletedAt' },
    userId: { type: DataTypes.BIGINT, field: 'UserId' },
    signalStrategyId: { type: DataTypes.BIGINT, field: 'SignalStrategyId' },
    budgetStrategyId: { type: DataTypes.BIGINT, field: 'BudgetStrategyId' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'Plan', // We need to choose the model name
  }
);

User.hasMany(IPlan);
IPlan.belongsTo(User, { foreignKey: { name: 'UserId' } });

ISignalStrategy.hasMany(IPlan);
IPlan.belongsTo(ISignalStrategy, { foreignKey: { name: 'SignalStrategyId' } });

IBudgetStrategy.hasMany(IPlan);
IPlan.belongsTo(IBudgetStrategy, { foreignKey: { name: 'BudgetStrategyId' } });

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true
export default IPlan;
