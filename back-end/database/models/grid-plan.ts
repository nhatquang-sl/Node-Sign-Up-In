import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import User from './user';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class GridPlan extends Model<InferAttributes<GridPlan>, InferCreationAttributes<GridPlan>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare lowerPrice: number;
  declare upperPrice: number;
  declare grid: number;
  declare gridMode: string;
  declare investment: number;
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
GridPlan.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: User, // 'users' would also work
        key: 'id',
      },
    },
    lowerPrice: {
      type: DataTypes.DECIMAL,
    },
    upperPrice: {
      type: DataTypes.DECIMAL,
    },
    grid: {
      type: DataTypes.SMALLINT,
    },
    gridMode: {
      type: DataTypes.STRING(20),
    },
    investment: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'GridPlan', // We need to choose the model name
    //A paranoid table is one that, when told to delete a record, it will not truly delete it.
    // Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request.
    paranoid: true,
  }
);

// the defined model is the class itself
export default GridPlan;
