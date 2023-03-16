/* import request from 'supertest';
import app from '../../../app.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
let accessToken;
let token;

describe('Testing Dish Routes', () => {

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: process.env.USER_ADMIN_TEST,
        password: process.env.PASS_ADMIN_TEST,
      });
    accessToken = loginRes.body.accessToken;
    const payload = {
      "UserInfo": {
        "id": '641127a4c6ff5fb1e85eadec',
        "roles": [4000,3000,2000,1000]
      }
    };
    const options = { expiresIn: '1h' };
    token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
  });

  describe('Testing Dish Routes', () => {
    it('should be able to authenticate a user with a valid JWT token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: process.env.USER_ADMIN_TEST,
          password: process.env.PASS_ADMIN_TEST,
        })
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toEqual(200);
    });
  })

  it('should be able to create a dish with admin role', async () => {
 
  });
})
 */