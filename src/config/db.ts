import { Dialect, Sequelize } from 'sequelize';
export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.USER_NAME as string,
    process.env.PASSWORD as string,
    { 
      logging: console.log,
      host: process.env.HOSTNAME,
      dialect: process.env.DILECT as Dialect, 
      port: process.env.DB_PORT as any,
      dialectOptions: process.env.NODE_ENV==='production'?{
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }:undefined
    },
  );