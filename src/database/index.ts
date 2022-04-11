import { Sequelize, QueryTypes } from 'sequelize';

import config from './config';

class DbContext {
  sequelize: Sequelize;

  constructor() {
    // Option 3: Passing parameters separately (other dialects)
    this.sequelize = new Sequelize('parkinglotsystem', 'nhatquang_sl_SQLLogin_1', 'h2omgkebzk', {
      host: 'parkinglotsystem.mssql.somee.com',
      dialect: 'mssql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
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
