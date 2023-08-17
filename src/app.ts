import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { handleError } from './middlewares/error.js';
import { userRouter } from './routers/user.router.js';
import { perfumeRouter } from './routers/perfume.router.js';

const debug = createDebug('FinalProject');

export const app = express();

debug('Start Express App');

const corsOptions = { origin: '*' };

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static('public'));

app.use('/user', userRouter);
app.use('/perfume', perfumeRouter);

app.use(handleError);
