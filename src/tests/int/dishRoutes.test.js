import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();

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
        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(dishData);
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 201 and create the dish', async () => {
        const res = await request(app)
          .post('/dishes')
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(dishData);
        expect(res.statusCode).toEqual(201);
        dishDataResId = res.body._id;
        console.log('este deve ser o ID criado', dishDataResId);

      });
    });
  })

  describe('<- Get dishes routes ->', () => {
    describe('Get a specific dish per id', () => {
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
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
            .send(dishData);
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('given user is logged in and has authorization', () => {
        it('should return a 200 and get the dishe', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
            .send(dishData);
          expect(res.statusCode).toEqual(200);
        });
      });
    })
    describe('Get all dishes route', () => {
      describe('given user is not logged in', () => {
        it('should return a 201', async () => {
          const res = await request(app)
            .get(`/dishes`)
            .send(dishData);
          expect(res.statusCode).toEqual(200);
        });
      })
      describe('given user is logged in', () => {
        it('should return a 203', async () => {
          const res = await request(app)
            .get(`/dishes`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
            .send(dishData);
          expect(res.statusCode).toEqual(200);
        });
      });
      describe('given user is logged in and has all authorizations', () => {
        it('should return a 200 and get the dishe', async () => {
          const res = await request(app)
            .get(`/dishes/${dishDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
            .send(dishData);
          expect(res.statusCode).toEqual(200);
        });
      });
    })
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
        const res = await request(app)
          .put(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(updatingDishData);
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and get all the dishes', async () => {
        const res = await request(app)
          .put(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(updatingDishData);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
  
  describe('<- Delete dish route ->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`);
        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 200 and delete dish', async () => {
        const res = await request(app)
          .delete(`/dishes/${dishDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
  /* describe('<- Add a image for an existing dish->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {
 
        const formData = new FormData();
        formData.append('image', fs.createReadStream('./imageTest/test-image.jpg'));
 
        const res = await request(app)
          .post('/dishes')
          .send(dishData);
        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {
        const formData = new FormData();
        formData.append('image', fs.createReadStream('./imageTest/test-image.jpg'));
 
        const res = await request(app)
          .post(`/dishes/${dishDataResId}/image`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .set('Content-Type', 'multipart/form-data')
          .send({ image: formData });
 
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 201 and create the dish', async () => {
 
        async function streamToBuffer(stream) {
          const chunks = [];
          return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
              chunks.push(chunk);
            });
            stream.on('error', reject);
            stream.on('end', () => {
              resolve(Buffer.concat(chunks));
            });
          });
        }
 
        const imagePath = path.join(cwd, '.', 'imageTest', 'test-image.jpg');
        const imageStream = fs.createReadStream(imagePath);
 
        const formData = new FormData();
        formData.append('image', imageStream);
        console.log('formdata', formData);
 
        const buffer = await streamToBuffer(formData);
 
        const res = await request(app)
          .post(`/dishes/${dishDataResId}/image`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .set('Content-Type', 'multipart/form-data')
          .send(buffer);
 
        expect(res.statusCode).toEqual(201);
      }, 20000);
    });
  }) */
});
