import { DataTypes } from 'sequelize';
import ISignalSource from './i-signal-source';
import ISignalStrategy from './i-signal-strategy';
import dbContext from '../db-context';

const ISignalStrategySource = dbContext.sequelize.define(
  'SignalStrategySource',
  { Id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true } },
  { timestamps: false }
);

ISignalStrategy.belongsToMany(ISignalSource, { through: ISignalStrategySource, as: 'sources' });
ISignalSource.belongsToMany(ISignalStrategy, { through: ISignalStrategySource });

// ISignalStrategy.belongsToMany(ISignalSource, { through: ISignalStrategySource, as: 'sources' });
// ISignalSource.belongsToMany(ISignalStrategy, { through: ISignalStrategySource });

export default ISignalStrategySource;
