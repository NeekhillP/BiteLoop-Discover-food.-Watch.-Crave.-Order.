import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import foodRouter from './routes/food.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * @route /api/auth
 * @desc Authentication routes
 */
app.use('/api/auth', authRouter)



/**
 * @route /api/food
 * @desc Food routes
 */
app.use('/api/food', foodRouter)


export default app;