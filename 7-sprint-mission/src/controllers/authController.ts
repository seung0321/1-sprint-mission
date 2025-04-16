import { Request, Response } from 'express';
import { create } from 'superstruct';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs';
import { authService } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);
  const user = await authService.register(email, nickname, password);
  return res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = create(req.body, LoginBodyStruct);
  await authService.login(email, password, res);
  return res.status(200).send();
};

export const logout = async (req: Request, res: Response) => {
  await authService.logout(res);
  return res.status(200).send();
};

export const refreshToken = async (req: Request, res: Response) => {
  await authService.refreshToken(req.cookies, res);
  return res.status(200).send();
};
