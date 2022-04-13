const config = {
  server: 'parkinglotsystem.mssql.somee.com',
  authentication: {
    type: 'default',
    options: {
      userName: 'nhatquang_sl_SQLLogin_1',
      password: 'h2omgkebzk'
    }
  },
  options: {
    port: 1433,
    database: 'parkinglotsystem',
    trustServerCertificate: true
  }
};

export default config;
