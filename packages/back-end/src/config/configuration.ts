import * as dotenv from 'dotenv';

const envHandler = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      dotenv.config({ path: '.env.test' });
      break;
    case 'development':
      dotenv.config({ path: '.env.development' });
      break;
    case 'production':
      dotenv.config({ path: '.env.production' });
      break;
    default:
      dotenv.config({ path: '.env' });
      break;
  }
};
envHandler();
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    sqlite: {
      file: process.env.DATABASE_FILE,
      synchronize: !!process.env.DATABASE_SYNCHRONIZE,
    },
  },
  api: {
    prefix: process.env.API_PREFIX,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
