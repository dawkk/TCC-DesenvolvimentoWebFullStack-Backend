import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const payloadWithProblem = {
  status: 7,
};
const payloadModified = {
  status: "Problemas Alterados",
};

const payload = {
  status: "Problemas",
};

let orderDataResId;
let orderWrongId = '642eeaa08b4fab4dd240f55c';

const getAccessToken = async (email, password) => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });
  return loginRes.body.accessToken;
};

const accessTokenSimpleUser = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
const accessTokenAdm = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);

afterAll(async () => {
  await db.close();
});

describe('Testing orders status routes', () => {

  describe('Create order status routes', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .post('/orders/status')
        .send(payload);

      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in, should return error 403', async () => {
      const res = await request(app)
        .post('/orders/status')
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        .send(payload);

      expect(res.statusCode).toEqual(403);
    });

    it('given user is logged in, but has wrong format sent should return error 500', async () => {
      const res = await request(app)
        .post('/orders/status')
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(payloadWithProblem);
      expect(res.statusCode).toEqual(500);
    });

    it('given user is logged in, should create order and return sucessfully 201 and create order status', async () => {
      const res = await request(app)
        .post('/orders/status')
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(payload);
      orderDataResId = res.body._id;
      expect(res.statusCode).toEqual(201);
    });

  })


  describe('Get orders status routes', () => {

    describe('Get all orders statuses', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders/status`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/orders/status`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get the orders statuses', async () => {
        const res = await request(app)
          .get(`/orders/status`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get a specific order status per id', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders/status/${orderDataResId}`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/orders/status/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, but is using non existing order status id should return error 404', async () => {
        const res = await request(app)
          .get(`/orders/status/${orderWrongId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(404);
      });

      it('given user is logged in and has authorization, should return a 200 and get the order status', async () => {
        const res = await request(app)
          .get(`/orders/status/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })
  })

  describe('Update order status route', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .put(`/orders/status/${orderDataResId}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(401);
    });


    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .put(`/orders/status/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(403);
    });

     it('given user is logged in and has authorization, but has wrong order status id should return error 404', async () => {
       const res = await request(app)
         .put(`/orders/status/${orderWrongId}`)
         .set('Authorization', `Bearer ${accessTokenAdm}`)
         .send(payloadModified);
       expect(res.statusCode).toEqual(404);
     });

    it('given user is logged in and has authorization, should return a 200 and update order status', async () => {
      const res = await request(app)
        .put(`/orders/status/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(200);
    });

  })

  describe('Delete order route', () => {

    it('given user is not logged in, should return a 401', async () => {
      const res = await request(app)
        .delete(`/orders/status/${orderDataResId}`)
      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .delete(`/orders/status/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
      expect(res.statusCode).toEqual(403);
    });
    
        it('given user is logged in and has authorization, but has wrong order status id should return error 404', async () => {
          const res = await request(app)
            .delete(`/orders/status/${orderWrongId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`);
          expect(res.statusCode).toEqual(404);
        });

    it('given user is logged in and has authorization, should return a 200 and delete order status', async () => {
      const res = await request(app)
        .delete(`/orders/status/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
