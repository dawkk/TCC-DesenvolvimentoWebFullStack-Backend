import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const paymentMethodData = { name: 'Paypal' };
const updatingPaymentMethodData = { name: 'Boleto' };
let paymentMethodDataResId;

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

describe('Testing payment methods routes', () => {

  describe('Create payment methods route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .post('/paymentMethods')
          .send(paymentMethodData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .post('/paymentMethods')
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(paymentMethodData);
        expect(res.statusCode).toEqual(403);
      });
      
      it('given user is logged in and has authorization, should return a 201 and create the payment method', async () => {
        const res = await request(app)
        .post('/paymentMethods')
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(paymentMethodData);
        expect(res.statusCode).toEqual(201);
        paymentMethodDataResId = res.body._id;
      });

      it('given user is logged in and has authorization but this request has a unique name which is already being used on database, should return error 500 and fail request', async () => {
        const res = await request(app)
          .post('/paymentMethods')
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(paymentMethodData);
        expect(res.statusCode).toEqual(500);
      });
    })
    

  describe('Get payment methods routes', () => {

    describe('Get a specific payment method per id', () => {

        it('given user is not logged in, should return error 401', async () => {
          const res = await request(app)
            .get(`/paymentMethods/${paymentMethodDataResId}`)
          expect(res.statusCode).toEqual(401);
        });

        it('given user is logged in,should return a 200 and get the payment method', async () => {
          const res = await request(app)
            .get(`/paymentMethods/${paymentMethodDataResId}`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in and has authorization, should return a 200 and get the payment method', async () => {
          const res = await request(app)
            .get(`/paymentMethods/${paymentMethodDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })

    describe('Get all payment methods route', () => {

        it('given user is not logged in, should return error 401', async () => {
          const res = await request(app)
            .get(`/paymentMethods`)
          expect(res.statusCode).toEqual(401);
        });

        it('given user is logged in, should return a 200 and get the payment method', async () => {
          const res = await request(app)
            .get(`/paymentMethods`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in and has all authorizations, should return a 200 and get the payment method', async () => {
          const res = await request(app)
            .get(`/paymentMethods`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })
  })

  describe('Update payment method route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/paymentMethods/${paymentMethodDataResId}`)
          .send(updatingPaymentMethodData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doest have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .put(`/paymentMethods/${paymentMethodDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(updatingPaymentMethodData);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get all the paymentMethods', async () => {
        const res = await request(app)
          .put(`/paymentMethods/${paymentMethodDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(updatingPaymentMethodData);
        expect(res.statusCode).toEqual(200);
      });
  })
  
  describe('Delete payment method route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .delete(`/paymentMethods/${paymentMethodDataResId}`);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .delete(`/paymentMethods/${paymentMethodDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });

    describe('', () => {
      it('given user is logged in and has authorization, should return a 200 and delete payment method', async () => {
        const res = await request(app)
          .delete(`/paymentMethods/${paymentMethodDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
});
