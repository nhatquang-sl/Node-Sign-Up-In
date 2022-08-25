import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
} from 'sequelize';
import { UserDto, UserAuthDto } from '@libs/user/dto';
import Role from './role';
import dbContext from '../db-context';

// https://sequelize.org/docs/v6/other-topics/typescript/
class User
  extends Model<
    InferAttributes<User, { omit: 'roles' }>,
    InferCreationAttributes<User, { omit: 'roles' }>
  >
  implements UserDto
{
  declare id: CreationOptional<number>;
  declare emailAddress: string;
  declare password: string;
  declare salt: string;
  declare firstName: string;
  declare lastName: string;
  declare securityStamp: string;
  declare emailConfirmed: boolean;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare roles?: NonAttribute<Role[]>;
  declare static associations: {
    roles: Association<User, Role>;
  };
  static getAuthDto(user: User, accessToken: string | undefined = undefined): UserAuthDto {
    const dto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      emailConfirmed: user.emailConfirmed,
      accessToken: accessToken,
    } as UserAuthDto;
    return dto;
  }
}

// class User extends Model {}

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
User.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: 'Id' },
    emailAddress: { type: DataTypes.STRING, field: 'EmailAddress', allowNull: false },
    password: { type: DataTypes.STRING, field: 'Password', allowNull: false },
    salt: { type: DataTypes.STRING(8), field: 'Salt', allowNull: false },
    firstName: { type: DataTypes.STRING, field: 'FirstName', allowNull: false },
    lastName: { type: DataTypes.STRING, field: 'LastName', allowNull: false },
    securityStamp: { type: DataTypes.STRING, field: 'SecurityStamp', allowNull: false },
    emailConfirmed: { type: DataTypes.BOOLEAN, field: 'EmailConfirmed', defaultValue: false },
    createdAt: { type: DataTypes.DATE, field: 'CreatedAt' },
    updatedAt: { type: DataTypes.DATE, field: 'UpdatedAt' },
  },
  {
    // Other model options go here
    sequelize: dbContext.sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
  }
);

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true
export default User;
