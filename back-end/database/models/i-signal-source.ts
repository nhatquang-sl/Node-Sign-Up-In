import {
  CreationOptional,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class ISignalSource extends Model<
  InferAttributes<ISignalSource>,
  InferCreationAttributes<ISignalSource>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare name: string;
  declare source: string;
  declare session: number;
  declare signal: number;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare deletedAt: CreationOptional<string>;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
ISignalSource.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      field: 'Id',
    },
    type: { type: DataTypes.STRING, field: 'Type', allowNull: false },
    name: { type: DataTypes.STRING, field: 'Name', allowNull: false },
    source: { type: DataTypes.STRING, field: 'Source' },
    session: { type: DataTypes.INTEGER, field: 'Session' },
    signal: { type: DataTypes.INTEGER, field: 'Signal' },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    updatedAt: { type: DataTypes.DATE, field: 'UpdatedAt' },
    deletedAt: { type: DataTypes.DATE, field: 'DeletedAt' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'SignalSource', // We need to choose the model name
  }
);

// // the defined model is the class itself
// console.log(Role === dbContext.sequelize.models.Role); // true
export default ISignalSource;
