import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/error-middleware';
import { PLATFORM_NAME } from './utils/globals';
import logger from 'morgan';
import path from 'path';

import { sequelize } from './config/db';
// @ts-ignore
global.PLATFORM_NAME = PLATFORM_NAME;
const app = express();

app.use(cookieParser());
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4000',
  process.env.FORWARDED_URL,
];
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      //for bypassing postman req with  no origin
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
} as CorsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions.credentials = true;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: '*',
  }),
);
// ASSOCIATIONS
import './utils/associations';
app.use('/media', express.static(path.join(__dirname, 'media')));

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import addressRoutes from './routes/address';
import categoryRoutes from './routes/category';
import filterRoutes from './routes/filter';
// product routes
import productRoutes from './routes/product/product'
import productImageRoutes from './routes/product/productImage'
import productVariantRoutes from './routes/product/productVariant'
import productVariantTypeRoutes from './routes/product/productVariantType'
import productTypesRoutes from './routes/product/productTypes'
import productSkuRoutes from './routes/product/productSku'


app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/user', userRoutes);
app.use('/v1/api/address', addressRoutes);
app.use('/v1/api/category', categoryRoutes);
app.use('/v1/api/filter', filterRoutes);
// product
app.use('/v1/api/product', productRoutes);
app.use('/v1/api/product/image', productImageRoutes);
app.use('/v1/api/product/types', productTypesRoutes);
app.use('/v1/api/product/variant', productVariantRoutes);
app.use('/v1/api/product/variant-type', productVariantTypeRoutes);
app.use('/v1/api/product/sku', productSkuRoutes);



//Error Handler
app.use(errorHandler);




const port = process.env.PORT;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);
try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    app.listen(port);
    console.log('listening to port ', port);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
export default app;
