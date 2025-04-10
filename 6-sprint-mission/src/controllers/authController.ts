import express, { Request, Response } from 'express';
import { create } from 'superstruct';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs';
import { withAsync } from '../lib/withAsync';
import { authService } from '../services/authService';

const authRouter = express.Router();

async function register(req: Request, res: Response) {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);
  const user = await authService.register(email, nickname, password);
  return res.status(201).json(user);
}

async function login(req: Request, res: Response) {
  const { email, password } = create(req.body, LoginBodyStruct);
  await authService.login(email, password, res);
  return res.status(200).send();
}

async function logout(req: Request, res: Response) {
  await authService.logout(res);
  return res.status(200).send();
}

async function refreshToken(req: Request, res: Response) {
  await authService.refreshToken(req.cookies, res);
  return res.status(200).send();
}

authRouter.post('/register', withAsync(register));
authRouter.post('/login', withAsync(login));
authRouter.post('/logout', withAsync(logout));
authRouter.post('/refresh', withAsync(refreshToken));

export default authRouter;
