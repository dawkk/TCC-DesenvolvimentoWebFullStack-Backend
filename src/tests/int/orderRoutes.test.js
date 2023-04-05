import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const userAddress = { city: "Campinas", state: "São Paulo", neighborhood: "Taquaral", street: "Rua do lugar", number: "1234", zipcode: "13820000", additionalInfo: "APT 115", mainAddress: true};
const userData = { firstName: "JohnUser", lastName: "Doe", email: "john@testuser.com", password: "classified123", cellphone: "(19)9999999999", addresses:["642b04d412c0606bcb21cbb2", "642b4389946a19f9755928b6", "642b43ed0e0666e7e5c3ffa0", "642b44a09e9fd6fc4ebb505c"] };

const payload = {
  /* userId: "613de7c8a39a0123456789ab", // replace with the user ID */
  deliveryAddress: "642b04d412c0606bcb21cbb2", // replace with the address ID
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
  totalPrice: 27.97, // optional, can be calculated based on the cart items
};

let orderDataResId;

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


  /* describe('Get user routes', () => {

    describe('Get user self information', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/users/me`)
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, should return a 200 and get user information', async () => {
        const accessTokenMe = await getAccessToken(userData.email, userData.password);
        const res = await request(app)
          .get(`/users/me`)
          .set('Authorization', `Bearer ${accessTokenMe}`)
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get a specific user per email', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/users/search`).query({ email: userData.email });
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/users/search`).query({ email: userData.email })
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get the user', async () => {
        const res = await request(app)
          .get(`/users/search`).query({ email: userData.email })
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
        userDataResId = res.body[0]._id
      });
    })

    describe('Get a specific user per id', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/users/${userDataResId}`)
        expect(res.statusCode).toEqual(401);
      });


      it('given user is logged in but has no required authorization, should return error 403', async () => {
        const res = await request(app)
          .get(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get the user', async () => {
        const res = await request(app)
          .get(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get all the users route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .get(`/users`)
          .send(userData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .get(`/users`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(userData);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has all authorizations, should return a 200 and get the user', async () => {
        const res = await request(app)
          .get(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(userData);
        expect(res.statusCode).toEqual(200);
      });
    })

    describe('Get address for user routes', () => {

      it('given user is not logged in, should return error 404', async () => {
        const res = await request(app)
          .get('/users/me/addresses')
        
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .get('/users/me/addresses')
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })
    
  })

  describe('Update user route', () => {

    it('given user is not logged in, should return error 401', async () => {
      const res = await request(app)
        .put(`/users/${userDataResId}`)
        .send(updatingUserData);
      expect(res.statusCode).toEqual(401);
    });


    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .put(`/users/${userDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
        .send(updatingUserData);
      expect(res.statusCode).toEqual(403);
    });


    it('given user is logged in and has authorization, should return a 200 and get all the user', async () => {
      const res = await request(app)
        .put(`/users/${userDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(updatingUserData);
      expect(res.statusCode).toEqual(200);
    });

    describe('Update address for user routes', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/users/me/addresses/${userDataResAddressId}`)
          .send(userAddressUpdate)
        
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .put(`/users/me/addresses/${userDataResAddressId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)
          .send(userAddressUpdate)

        expect(res.statusCode).toEqual(200);
      });
    })

  })

  describe('Delete user route', () => {

    it('given user is not logged in, should return a 401', async () => {
      const res = await request(app)
        .delete(`/users/${userDataResId}`);
      expect(res.statusCode).toEqual(401);
    });

    it('given user is logged in but doesnt have required authorizations, should return error 403', async () => {
      const res = await request(app)
        .delete(`/users/${userDataResId}`)
        .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
      expect(res.statusCode).toEqual(403);
    });

    it('given user is logged in and has authorization, should return a 200 and delete user', async () => {
      const res = await request(app)
        .delete(`/users/${userDataResId}`)
        .set('Authorization', `Bearer ${accessTokenAdm}`);
      expect(res.statusCode).toEqual(200);
    });

    describe('Delete address for user routes', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .delete(`/users/me/addresses/${userDataResAddressId}`)
        
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in, should return sucessfully 200', async () => {
        const accessTokenMe = await getAccessToken(process.env.USER_SIMPLE_TEST, process.env.PASS_SIMPLE_TEST)
        const res = await request(app)
          .delete(`/users/me/addresses/${userDataResAddressId}`)
          .set('Authorization', `Bearer ${accessTokenMe}`)

        expect(res.statusCode).toEqual(200);
      });
    })
  }); */
});
