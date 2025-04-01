import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController';
import { withAsyncVoid } from '../lib/withAsync';

const authRouter = express.Router();

authRouter.post('/register', withAsyncVoid(register));
authRouter.post('/login', withAsyncVoid(login));
authRouter.post('/logout', withAsyncVoid(logout));
authRouter.post('/refresh', withAsyncVoid(refreshToken));

export default authRouter;
