import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';
import paymentMethods from '../../models/paymentMethod.js';

dotenv.config();

/* JUST TO REMEMBER, THE STATUS OF EVERY ORDER STARTS AS PENDING AS PER CONTROLLER */

const userData = { firstName: "JohnUser", lastName: "Doe", email: "john@testuser.com", password: "classified123", cellphone: "(19)9999999999", addresses: ["642b04d412c0606bcb21cbb2", "642b4389946a19f9755928b6", "642b43ed0e0666e7e5c3ffa0", "642b44a09e9fd6fc4ebb505c"] };

let orderDataResId;
let orderWrongPathId;

async function getPaymentMethodId(paymentMethodName) {
  try {
    const paymentMethod = await paymentMethods.findOne({ name: paymentMethodName });
    if (!paymentMethod) {
      throw new Error(`Payment method not found with name: ${paymentMethodName}`);
    }
    return paymentMethod._id.toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const paymentMethodDinheiro = await getPaymentMethodId("Dinheiro")

const payload = {
  deliveryAddress: "642b04d412c0606bcb21cbb2",
  cartItems: [
    {
      id: "640e7844fad834ccf1eb1362",
      name: "Salada Simples",
      price: 25,
      quantity: 2,
    },
    {
      id: "640e78b6fad834ccf1eb1370",
      name: "Risoto de Frutos do Mar",
      price: 58,
      quantity: 2,
    },
  ],
  paymentMethod:paymentMethodDinheiro,
  totalPrice: 27.97,
};

const payloadModified = {
  deliveryAddress: "642b4389946a19f9755928b6",
  cartItems: [
    {
      id: "640e7844fad834ccf1eb1362",
      name: "Salada Simples",
      price: 35,
      quantity: 3,
    },
    {
      id: "640e78b6fad834ccf1eb1370",
      name: "Risoto de Frutos do Mar",
      price: 25,
      quantity: 5,
    },
  ],
  paymentMethod:paymentMethodDinheiro,
  totalPrice: 95,
};

const payloadWithFaultyAddress = {
  deliveryAddress: "642b04d412c0606bcb21ccc2",
  cartItems: [
    {
      id: "640e7844fad834ccf1eb1362",
      name: "Salada Simples",
      price: 25,
      quantity: 2,
    },
    {
      id: "640e78b6fad834ccf1eb1370",
      name: "Risoto de Frutos do Mar",
      price: 58,
      quantity: 2,
    },
  ],
  paymentMethod:paymentMethodDinheiro,
  totalPrice: 27.97,
};

const getAccessToken = async (email, password) => {
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });
  return loginRes.body.accessToken;
};

const accessTokenSimpleUser = await getAccessToken(userData.email, userData.password);
const accessTokenAdm = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST);

afterAll(async () => {
  await db.close();
});

describe('Testing orders routes', () => {

  describe('Create order routes', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .post('/orders')
        .send(payload);

      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in, should return error 404', async () => {
      const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${accessTokenMe}`)
        .send(payloadWithFaultyAddress);

      expect(res.statusCode).toEqual(404);
    });

    it('given user is logged in, should create order and return sucessfully 201', async () => {
      const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${accessTokenMe}`)
        .send(payload);
      orderDataResId = res.body._id;
      expect(res.statusCode).toEqual(201);
    });

  })


  describe('Get orders routes', () => {

    describe('Get all orders for own user', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders/me`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, but has no orders should return error 404', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST)
        const res = await request(app)
          .get(`/orders/me`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given user is logged in, and has orders should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/orders/me`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get specific order id for own user', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders/me/${orderDataResId}`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, but has wrong order id should return error 404', async () => {
        orderWrongPathId = '642eeaa08b4fab4dd240f55c'
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/orders/me/${orderWrongPathId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given different user is logged in, and tries to get an order from another user should return error 404', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST)
        const res = await request(app)
          .get(`/orders/me/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given user is logged in, and has orders should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/orders/me/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get all orders', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/orders`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get the orders', async () => {
        const res = await request(app)
          .get(`/orders`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get a specific order per id', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/orders/${orderDataResId}`)
        expect(res.statusCode).toEqual(401);
      });


      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/orders/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return error 500', async () => {
        orderWrongPathId = '642eeaa08b4fab4dd240f55c'
        const res = await request(app)
          .get(`/orders/${orderWrongPathId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(500);
      });

      it('given user is logged in and has authorization, should return a 200 and get the order', async () => {
        const res = await request(app)
          .get(`/orders/${orderDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })
  })

  describe('Update order route', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .put(`/orders/${orderDataResId}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(401);
    });


    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .put(`/orders/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(403);
    });


    it('given user is logged in and has authorization, should return a 200 and get all the user', async () => {
      const res = await request(app)
        .put(`/orders/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(payloadModified);
      expect(res.statusCode).toEqual(200);
    });

  })

  describe('Delete order route', () => {

    it('given user is not logged in, should return a 401', async () => {
      const res = await request(app)
        .delete(`/orders/${orderDataResId}`)
      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .delete(`/orders/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
      expect(res.statusCode).toEqual(403);
    });

    it('given user is logged in and has authorization, should return a 200 and delete user', async () => {
      const res = await request(app)
        .delete(`/orders/${orderDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
