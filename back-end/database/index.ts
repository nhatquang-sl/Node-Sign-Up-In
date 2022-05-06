import ENV from '@config';
import { Sequelize } from 'sequelize';

class DbContext {
  sequelize: Sequelize;

  constructor() {
    // Option 3: Passing parameters separately (other dialects)
    this.sequelize = new Sequelize(ENV.DB_NAME, ENV.DB_USERNAME, ENV.DB_PASSWORD, {
      host: ENV.DB_HOST,
      dialect: 'mssql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
      // query: { raw: true },
    });
  }

  /**
   * Connects to database
   */
  async connect() {
    try {
      await this.sequelize.authenticate();

      console.log('Connected to database');
    } catch (e: any) {
      console.log('Occured error when connecting to database. Error:', e.message);
    }
  }
}

const dbContext = new DbContext();

export default dbContext;
