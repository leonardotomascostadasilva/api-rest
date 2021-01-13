module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '12345',
      database: 'apiproject',
    },
    migrations: {
      directory:'src/migrations',
    },
  },
};