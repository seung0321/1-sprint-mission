import request from 'supertest';
import app from '../../app';

export const registerAndLogin = async () => {
  const agent = request.agent(app);

  const user = await agent.post('/auth/register').send({
    email: 'test@example.com',
    password: 'password',
    nickname: 'test User',
  });

  const login = await agent.post('/auth/login').send({
    email: 'test@example.com',
    password: 'password',
  });

  return { agent, user, login };
};
