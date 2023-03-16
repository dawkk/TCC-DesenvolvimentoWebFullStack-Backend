import request from 'supertest';
import app from '../../../app.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import users from '../../../models/user.js';

dotenv.config();

const dishData = { id: '1', title: 'Test dish', description: 'Test dish description', price: 10, menu: '641130b63fa6913196f0ac28', type: 'Test type' };

const getAccessToken = async (email, password) => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });
    console.log('accessToken aqui do ', email, loginRes.body.accessToken)
  return loginRes.body.accessToken;
};

describe('Testing dish routes', () => {

  describe('Create dish route ->', () => {
    /* describe('given user is not logged in', () => {
      it('should return a 403', async () => {
        const res = await request(app)
          .post('/dishes')
          .send(dishData);

        expect(res.statusCode).toEqual(403);
      });
    }) */
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {

        const accessToken  = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST);

        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dishData);

        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 201 and create the dish', async () => {

        const accessToken = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);

        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dishData);

        expect(res.statusCode).toEqual(201);
      });
    });
  })
});
