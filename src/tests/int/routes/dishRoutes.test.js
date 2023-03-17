import request from 'supertest';
import app from '../../../app.js';
import * as dotenv from 'dotenv';
import db from '../../../config/dbConnect.js';

dotenv.config();

const dishData = { id: '1', title: 'Test dish', description: 'Test dish description', price: 10, menu: '641130b63fa6913196f0ac28', type: 'Test type' };
const updatingDishData = { id: '2', title: 'Test updated dish', description: 'Test updated dish description', price: 15, menu: '6414c68a1ccf11f0297d6272', type: 'Test update type' };
const testingAlreadyExistingDish = '6411149d76711b90da3b9e1e';
let dishDataResId;

const getAccessToken = async (email, password) => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });
  console.log('accessToken aqui do ', email, loginRes.body.accessToken)
  return loginRes.body.accessToken;
};

afterAll(async () => {
  await db.close();
});

describe('Testing dish routes', () => {

  describe('<- Create dish route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {

        const res = await request(app)

          .post('/dishes')
          .send(dishData);

        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {

        const accessToken = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST);
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

        let dishDataResId = res.body._id;

        console.log('este deve ser o ID criado', dishDataResId);
      });
    });
  })
  describe('<- Get dish route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {

        const res = await request(app)

          .get(`/dishes/${dishDataResId}`)
          .send(dishData);

        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {

        const accessToken = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST);
        const res = await request(app)

          .get(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dishData);

        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and get the dishe', async () => {

        const accessToken = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);
        const res = await request(app)

          .get(`/dishes/${testingAlreadyExistingDish}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dishData);

        expect(res.statusCode).toEqual(200);
      });
    });
  })
  describe('<- Update dish route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {

        const res = await request(app)

          .put(`/dishes/${dishDataResId}`)
          .send(updatingDishData);

        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {

        const accessToken = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST);
        const res = await request(app)

          .put(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updatingDishData);

        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and get all the dishes', async () => {

        const accessToken = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);
        const res = await request(app)

          .put(`/dishes/${testingAlreadyExistingDish}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updatingDishData);

        expect(res.statusCode).toEqual(200);
      });
    });
  })
});
