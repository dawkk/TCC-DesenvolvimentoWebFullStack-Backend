import request from 'supertest';
import app from '../../app.js';

const createOrderItem = async (accessToken, dishId, quantity) => {
  const response = await request(app)
    .post('/orderItems/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ dishId, quantity });

  const { _id } = response.body;
  return _id;
};

const createOrderItems = async (accessToken) => {
  const orderItemIds = [];
  // Create order item 1
  const orderItemId1 = await createOrderItem(
    accessToken,
    '640e7844fad834ccf1eb1362',
    2
  );
  orderItemIds.push(orderItemId1);

  const orderItemId2 = await createOrderItem(
    accessToken,
    '640e78b6fad834ccf1eb1370',
    3
  );
  orderItemIds.push(orderItemId2);


  return orderItemIds;
};

export { createOrderItems };
