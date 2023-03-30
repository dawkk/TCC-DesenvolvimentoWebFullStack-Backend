import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const userData = { firstName: "JohnUser", lastName: "Doe", email: "john@testuser.com", password: "classified123", cellphone: "(19)9999999999" };
const updatingUserData = { firstName: "JohnUserModified", lastName: "DoeModified", email: "john@user.com", password: "classified123", cellphone: "(19)9999999999" };
let userDataResId;

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

describe('Testing user routes', () => {
  describe('<- Create user route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 201', async () => {
        const res = await request(app)
          .post('/users')
          .send(userData);
        userDataResId = res.body._id;
        expect(res.statusCode).toEqual(201);
      });
    })
    describe('given user email is already being used in another register', () => {
      it('should not register and return a 422', async () => {
        const res = await request(app)
          .post('/users')
          .send(userData);
        expect(res.statusCode).toEqual(422);
      });
    });
  })
  describe('<- Get user routes ->', () => {
    describe('Get a specific user per email', () => {
      describe('given user is not logged in', () => {
        it('should return a 401', async () => {
          const res = await request(app)
            .get(`/users/search`).query({ email: userData.email });
          expect(res.statusCode).toEqual(401);
        });
      })
      describe('given user is logged in but has no required authorization', () => {
        it('should return a 403', async () => {
          const res = await request(app)
            .get(`/users/search`).query({ email: userData.email })
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('given user is logged in and has authorization', () => {
        it('should return a 200 and get the user', async () => {
          const res = await request(app)
            .get(`/users/search`).query({ email: userData.email })
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
          userDataResId = res.body[0]._id
          console.log('user ID', userDataResId)
        });
      });
    })

    describe('Get a specific user per id', () => {
      describe('given user is not logged in', () => {
        it('should return a 401', async () => {
          const res = await request(app)
            .get(`/users/${userDataResId}`)
          expect(res.statusCode).toEqual(401);
        });
      })
      describe('given user is logged in but has no required authorization', () => {
        it('should return a 403', async () => {
          const res = await request(app)
            .get(`/users/${userDataResId}`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('given user is logged in and has authorization', () => {
        it('should return a 200 and get the user', async () => {
          const res = await request(app)
            .get(`/users/${userDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
      });
    })
    describe('Get all the users route', () => {
      describe('given user is not logged in', () => {
        it('should return a 401', async () => {
          const res = await request(app)
            .get(`/users`)
            .send(userData);
          expect(res.statusCode).toEqual(401);
        });
      })
      describe('given user is logged in', () => {
        it('should return a 403', async () => {
          const res = await request(app)
            .get(`/users`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
            .send(userData);
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('given user is logged in and has all authorizations', () => {
        it('should return a 200 and get the user', async () => {
          const res = await request(app)
            .get(`/users/${userDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
            .send(userData);
            expect(res.statusCode).toEqual(200);
          });
        });
      })
    })
    
  describe('<- Update user route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {
        const res = await request(app)
          .put(`/users/${userDataResId}`)
          .send(updatingUserData);
        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {
        const res = await request(app)
          .put(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(updatingUserData);
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and get all the user', async () => {
        const res = await request(app)
          .put(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(updatingUserData);
        expect(res.statusCode).toEqual(200);
      });
    });
  })

  describe('<- Delete user route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {
        const res = await request(app)
          .delete(`/users/${userDataResId}`);
        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {
        const res = await request(app)
          .delete(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and delete user', async () => {
        const res = await request(app)
          .delete(`/users/${userDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
});
