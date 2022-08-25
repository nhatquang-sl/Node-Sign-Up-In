import ISignalSource from './i-signal-source';
import ISignalStrategy from './i-signal-strategy';
import dbContext from '../db-context';

const ISignalStrategySource = dbContext.sequelize.define(
  'SignalStrategySource',
  {},
  { timestamps: false }
);

ISignalStrategy.belongsToMany(ISignalSource, {
  through: ISignalStrategySource,
  onDelete: 'CASCADE',
});
ISignalSource.belongsToMany(ISignalStrategy, {
  through: ISignalStrategySource,
  onDelete: 'CASCADE',
});

export default ISignalStrategySource;
