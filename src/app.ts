import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import articlesRouter from './routers/articlesRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentRouter';
import imagesRouter from './routers/imagesRouter';
import authRouter from './routers/authRouter';
import usersRouter from './routers/usersRouter';
import notificationrouter from './routers/notificationRoutre';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/notification', notificationrouter);

app.get('/crash', (req, res) => {
  res.send('서버를 죽입니다');
  process.exit(1);
});

app.get('/stdout', (req, res) => {
  console.log('일반 로그');
  console.log(process.env.NODE_ENV);
  res.send('stdout 요청');
});

app.get('/stderr', (req, res) => {
  console.error('에러 로그');
  res.send('stderr 요청');
});

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
