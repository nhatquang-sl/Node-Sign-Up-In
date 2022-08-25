import User from './user';
import Role from './role';
import dbContext from '../db-context';

const UserRole = dbContext.sequelize.define('UserRole', {}, { timestamps: false });
User.belongsToMany(Role, { as: 'roles', through: UserRole, onDelete: 'CASCADE' });
Role.belongsToMany(User, { through: UserRole, onDelete: 'CASCADE' });

export default UserRole;
