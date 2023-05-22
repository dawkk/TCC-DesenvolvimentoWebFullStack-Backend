import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';
import paymentMethods from '../../models/paymentMethod.js';

dotenv.config();

const userData = { firstName: "JohnUser", lastName: "Doe", email: "john@testuser.com", password: "classified123", cellphone: "(19)9999999999", addresses: ["642b04d412c0606bcb21cbb2", "642b4389946a19f9755928b6", "642b43ed0e0666e7e5c3ffa0", "642b44a09e9fd6fc4ebb505c"] };

let checkoutDataResId;
let checkoutWrongPathId;

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
      _id: "6457d8dc0fef62c68505ea5b",
    },
    {
      _id: "6457d9a80fef62c68505ea5e",
    },
  ],
  paymentMethod: paymentMethodDinheiro,
  totalAmount: 27.97,
};

const payloadModified = {
  deliveryAddress: "642b4389946a19f9755928b6",
  cartItems: [
    {
      _id: "6457d8dc0fef62c68505ea5b",
    },
    {
      _id: "6457d9a80fef62c68505ea5e",
    },
  ],
  paymentMethod: paymentMethodDinheiro,
  totalAmount: 95,
};

const payloadWithFaultyAddress = {
  deliveryAddress: "642b04d412c0606bcb21ccc2",
  cartItems: [
    {
      _id: "6457d8dc0fef62c68505ea5b",
    },
    {
      _id: "6457d9a80fef62c68505ea5e",
    },
  ],
  paymentMethod: paymentMethodDinheiro,
  totalAmount: 27.97,
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

describe('Testing checkouts routes', () => {

  describe('Create checkouts routes', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .post('/checkouts')
        .send(payload);

      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in but has wrong address id, should return error 404', async () => {
      const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
      const res = await request(app)
        .post('/checkouts')
        .set('Authorization', `Bearer ${accessTokenMe}`)
        .send(payloadWithFaultyAddress);

      expect(res.statusCode).toEqual(404);
    });

    it('given user is logged in, should create checkouts and return sucessfully 201', async () => {
      const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
      const res = await request(app)
        .post('/checkouts')
        .set('Authorization', `Bearer ${accessTokenMe}`)
        .send(payload);
      checkoutDataResId = res.body._id;
      expect(res.statusCode).toEqual(201);
    });

  })

  describe('Get checkouts routes', () => {

    describe('Get all checkouts for own user', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/checkouts/me`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, but has no checkouts should return error 404', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST)
        const res = await request(app)
          .get(`/checkouts/me`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given user is logged in, and has checkouts should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/checkouts/me`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get specific checkouts id for own user', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/checkouts/me/${checkoutDataResId}`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, but has wrong checkouts id should return error 404', async () => {
        checkoutWrongPathId = '642eeaa08b4fab4dd240f55c'
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/checkouts/me/${checkoutWrongPathId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given different user is logged in and tries to get an checkouts from another user with exclusive user route, should return error 404', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_ADMIN_TEST, process.env.PASS_ADMIN_TEST)
        const res = await request(app)
          .get(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(404);
      });

      it('given user is logged in, and has checkouts should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get all checkouts', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/checkouts`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/checkouts`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get the checkouts', async () => {
        const res = await request(app)
          .get(`/checkouts`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get a specific checkouts per id', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/checkouts/${checkoutDataResId}`)
        expect(res.statusCode).toEqual(401);
      });


      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization but wrong path id, should return error 500', async () => {
        checkoutWrongPathId = '642eeaa08b4fab4dd240f55c'
        const res = await request(app)
          .get(`/checkouts/${checkoutWrongPathId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(500);
      });

      it('given user is logged in and has authorization, should return a 200 and get the checkouts', async () => {

        /* JUST A REMINDER WHILE WE SETUP ORDER ROUTES, THIS WAS FAILING BECAUSE MODEL paymentMethod had wrong name linking models, and on populate it was written as per model paymentMethod and not per model of checkpoint */
        const res = await request(app)
          .get(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })
  })

  describe('Update checkouts route', () => {

    describe('Update checkout for own user route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/checkouts/me/${checkoutDataResId}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(401);
      });


      it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .put(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(403);
      });


      it('given user is logged in and has authorization, should return a 200 and update checkout', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .put(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(200);
      });
    })


    describe('Update checkouts staff route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/checkouts/${checkoutDataResId}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(401);
      });


      it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .put(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(403);
      });


      it('given user is logged in and has authorization, should return a 200 and update checkout', async () => {
        const res = await request(app)
          .put(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(payloadModified);
        expect(res.statusCode).toEqual(200);
      });
    })
  })

  describe('Delete checkouts route', () => {

    describe('Delete checkouts for own user route', () => {
      it('given user is not logged in, should return a 401', async () => {
        const res = await request(app)
          .delete(`/checkouts/me/${checkoutDataResId}`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .delete(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and delete user', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .delete(`/checkouts/me/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`);
        expect(res.statusCode).toEqual(200);
      });
    });

    describe('Delete checkouts staff route', () => {
      it('given user is not logged in, should return a 401', async () => {
        const res = await request(app)
          .delete(`/checkouts/${checkoutDataResId}`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .delete(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and delete user', async () => {
        const res = await request(app)
          .delete(`/checkouts/${checkoutDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
});
