import request from 'supertest';
import app from '../../app.js';
import * as dotenv from 'dotenv';
import db from '../../config/dbConnect.js';

dotenv.config();

const menuData = { name: 'Lanche' };
const updatingMenuData = { name: 'Lanche da Tarde' };
let menuDataResId;

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

describe('Testing menu routes', () => {

  describe('Create menu route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .post('/menus')
          .send(menuData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .post('/menus')
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(menuData);
        expect(res.statusCode).toEqual(403);
      });
      
      it('given user is logged in and has authorization, should return a 201 and create the menu', async () => {
        const res = await request(app)
        .post('/menus')
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(menuData);
        expect(res.statusCode).toEqual(201);
        menuDataResId = res.body._id;
      });
    })
    
    it('given user is logged in and has authorization but this request has a unique name which is already being used on database, should return error 500 and fail request', async () => {
      const res = await request(app)
        .post('/menus')
        .set('Authorization', `Bearer ${accessTokenAdm}`)
        .send(menuData);
      expect(res.statusCode).toEqual(500);
    });
  describe('Get menus routes', () => {

    describe('Get a specific menu per id', () => {

        it('given user is not logged in, should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus/${menuDataResId}`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in,should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus/${menuDataResId}`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in and has authorization, should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus/${menuDataResId}`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })

    describe('Get all menus route', () => {

        it('given user is not logged in, should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in, should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus`)
            .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          expect(res.statusCode).toEqual(200);
        });

        it('given user is logged in and has all authorizations, should return a 200 and get the menu', async () => {
          const res = await request(app)
            .get(`/menus`)
            .set('Authorization', `Bearer ${accessTokenAdm}`)
          expect(res.statusCode).toEqual(200);
        });
    })
  })

  describe('Update menu route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .put(`/menus/${menuDataResId}`)
          .send(updatingMenuData);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doest have required authorizations, should return error 403', async () => {
        const res = await request(app)
          .put(`/menus/${menuDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .send(updatingMenuData);
        expect(res.statusCode).toEqual(403);
      });

      it('given user is logged in and has authorization, should return a 200 and get all the menus', async () => {
        const res = await request(app)
          .put(`/menus/${menuDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .send(updatingMenuData);
        expect(res.statusCode).toEqual(200);
      });
  })
  
  describe('Delete menu route', () => {

      it('given user is not logged in, should return error 401', async () => {
        const res = await request(app)
          .delete(`/menus/${menuDataResId}`);
        expect(res.statusCode).toEqual(401);
      });

      it('given user is logged in but doesnt have required authorization, should return error 403', async () => {
        const res = await request(app)
          .delete(`/menus/${menuDataResId}`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`);
        expect(res.statusCode).toEqual(403);
      });

    describe('', () => {
      it('given user is logged in and has authorization, should return a 200 and delete menu', async () => {
        const res = await request(app)
          .delete(`/menus/${menuDataResId}`)
          .set('Authorization', `Bearer ${accessTokenAdm}`);
        expect(res.statusCode).toEqual(200);
      });
    });
  })
  /* describe('<- Add a image for an existing menu->', () => {
    describe('given user is not logged in', () => {
      it('should return a 401', async () => {
 
        const formData = new FormData();
        formData.append('image', fs.createReadStream('./imageTest/test-image.jpg'));
 
        const res = await request(app)
          .post('/menus')
          .send(menuData);
        expect(res.statusCode).toEqual(401);
      });
    })
    describe('given user is logged in but has no required authorization', () => {
      it('should return a 403', async () => {
        const formData = new FormData();
        formData.append('image', fs.createReadStream('./imageTest/test-image.jpg'));
 
        const res = await request(app)
          .post(`/menus/${menuDataResId}/image`)
          .set('Authorization', `Bearer ${accessTokenSimpleUser}`)
          .set('Content-Type', 'multipart/form-data')
          .send({ image: formData });
 
        expect(res.statusCode).toEqual(403);
      });
    });
    describe('given user is logged in and has authorization', () => {
      it('should return a 201 and create the menu', async () => {
 
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
          .post(`/menus/${menuDataResId}/image`)
          .set('Authorization', `Bearer ${accessTokenAdm}`)
          .set('Content-Type', 'multipart/form-data')
          .send(buffer);
 
        expect(res.statusCode).toEqual(201);
      }, 20000);
    });
  }) */
});
