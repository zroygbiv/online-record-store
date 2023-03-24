import request from 'supertest';
import { app } from '../../app';

it('fails when non-existent email is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'asdfasdfafds'
      })
      .expect(400);
});

it('responds with cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);
  
  // .toBeDefined(); refer - app.ts:21
  expect(response.get('Set-Cookie')).toBeDefined();
});