import { Dialect } from 'sequelize';

require('dotenv').config(); // Load environment variables

const config = {
  development: {
    use_env_variable: 'DB_URL',
    dialect: 'mysql' as Dialect,
  },
  test: {
    use_env_variable: 'DB_URL',
    dialect: 'mysql' as Dialect,
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'mysql' as Dialect,
  },
};

module.exports= config;