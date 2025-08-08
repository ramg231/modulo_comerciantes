import dotenv from 'dotenv';


dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'
});

export const config = {
  port: process.env.PORT || 4000,
  secretJwtSeed: process.env.SECRET_JWT_SEED,
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  baseUrl: process.env.BASE_URL
};