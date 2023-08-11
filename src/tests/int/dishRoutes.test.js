import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const dishData = { id: '1', title: 'Test dish', description: 'Test dish description', price: 10, menu: '641130b63fa6913196f0ac28', type: 'Test type' };
const updatingDishData = { id: '2', title: 'Test updated dish', description: 'Test updated dish description', price: 15, menu: '6414c68a1ccf11f0297d6272', type: 'Test update type' };
let dishDataResId;

const getAccessToken = async (email, password) => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });
  return loginRes.body.accessToken;
};

const accessTokenSimpleUser = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST);
const accessTokenAdm = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);

afterAll(async () => {
  await db.close();
});

describe('Testing dish routes', () => {

  describe('Create dish route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .post('/dishes')
          .send(dishData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(dishData);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 201 and create the dish', async () => {
        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(dishData);
        expect(res.statusCode).toEqual(201);
        dishDataResId = res.body._id;
      });
  })

  describe('Get dishes routes', () => {

    describe('Get a specific dish per id', () => {

        it('given user is not logged in, should return error 401', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
          expect(res.statusCode).toEqual(401);
        });

        it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(403);
        });

        it('given user is logged in and has authorization, should return a 200 and get the dish', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })

    describe('Get all dishes route', () => {

        it('given user is not logged in, should return error 401', async () => {
          const res = await request(app)
            .get(`/dishes/all`)
          expect(res.statusCode).toEqual(401);
        });

        it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
          const res = await request(app)
            .get(`/dishes/all`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(403);
        });

        it('given user is logged in and has all authorizations, should return a 200 and get the dish', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })
  })

  describe('Update dish route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/dishes/${dishDataResId}`)
          .send(updatingDishData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doest have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .put(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(updatingDishData);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get all the dishes', async () => {
        const res = await request(app)
          .put(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(updatingDishData);
        expect(res.statusCode).toEqual(200);
      });
  })
  
  describe('Delete dish route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });

    describe('', () => {
      it('given user is logged in and has authorization, should return a 200 and delete dish', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
});
