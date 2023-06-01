


import dishes from './dish.js';
import menus from './menu.js';
import orders from './order.js';
import orderItems from './orderItems.js';
import orderStatus from './orderStatus.js';
import paymentMethods from './paymentMethod.js';
import users from './user.js';
import addresses from './userAddressess.js';

// Create sample data for addresses and return the address ID

const menuMap = {};
const dishMap = {};
const userMap = {};
const addressMap = {};
const paymentMap = {};
const orderStatusMap = {};
const orderItemMap = new Map();

async function createMenus() {
  const initialMenus = [
    {
      name: "Entrada",
      image: "image-1681655140312.jpg"
    },
    {
      name: "Prato Principal",
      image: "image-1681655292917.jpg"
    },
    {
      name: "Sobremesa",
      image: "image-1681655302285.jpg"
    },
    {
      name: "Lanches",
      image: "image-1681655285435.jpg"
    }
  ];

  try {
    await menus.insertMany(initialMenus);

    const insertedMenus = await menus.find({ name: { $in: initialMenus.map(menu => menu.name) } });
    insertedMenus.forEach(menu => {
      menuMap[menu.name] = menu._id;
    });

    return menuMap;

  } catch (error) {
    console.error(`Error while creating menus: ${error}`);
  }
}


async function createDishes(menuMap) {
  const initialDishes = [
    {
      title: "Salada Simples",
      description: "Alface americana, croutons crocantes, tomates-cereja frescos, parmesão ralado e molho ceasar.",
      price: 25,
      menu: "Entrada",
      image: "Salada-Simples.jpg"
    },
    {
      title: "Risoto de Frutos do Mar",
      description: "Arroz arbóreo com camarão, lula, polvo e mariscos, temperados com azeite, alho, tomate e ervas.",
      price: 58,
      menu: "Prato Principal",
      image: "Risoto-Frutos-Do-Mar.jpg"
    },
    {
      title: "Churrasco Misto",
      description: "Seleção de carnes grelhadas, incluindo picanha, alcatra, fraldinha, linguiça e coração de frango, servida com farofa, vinagrete e pão de alho.",
      price: 80,
      menu: "Prato Principal",
      image: "Churrasco.jpg"
    },
    {
      title: "Yakissoba",
      description: "Macarrão frito com legumes, cogumelos, carne bovina e frango, em molho à base de shoyu e óleo de gergelim.",
      price: 39.9,
      menu: "Prato Principal",
      image: "yakissoba.jpg"
    },
    {
      title: "Ceviche de Salmão",
      description: "Cubos de salmão marinados em suco de limão, temperados com coentro, rabanetes finos e pimenta dedo-de-moça e pimentão verde",
      price: 42,
      menu: "Entrada",
      image: "ceviche.jpg"
    },
    {
      title: "Burguer Tradicional",
      description: "Cheeseburguer com dois hamburguers blend da casa de 150g, muito cheddar inglês, alface, tomate, molho da casa rose",
      price: 40,
      menu: "Lanches",
      image: "burguer-duplo.jpg"
    },
    {
      title: "Burguer Tradicional",
      description: "Cheeseburguer com hamburguer blend da casa de 150g, muito cheddar inglês, alface, tomate, molho da casa a base de alho",
      price: 35,
      menu: "Lanches",
      image: "burguer-tradicional.jpg"
    },
    {
      title: "Brigadeiro Gourmet",
      description: "Delicioso doce de chocolate, feito com leite condensado, manteiga e cacau em pó, coberto com granulado.",
      price: 5,
      menu: "Sobremesa",
      image: "brigadeiro.jpg"
    },
    {
      title: "Cookie",
      description: "Delicioso cookie tradicional com gotas de chocolate.",
      price: 4,
      menu: "Sobremesa",
      image: "cookie.jpg"
    },
    {
      title: "Sanduiche de Cookies recheado",
      description: "Sanduiche de cookies, dois deliciosos cookies tradicionais com gotas de chocolate, recheados com sorvete de creme.",
      price: 10,
      menu: "Sobremesa",
      image: "cookieRecheado.jpg"
    },
    {
      title: "Brownies",
      description: "Delicioso brownie de chocolate com nozes levemente assadas.",
      price: 5,
      menu: "Sobremesa",
      image: "brownies.jpg"
    },
  ];

  console.log('This is menuMap inside the dishes function before assignment', menuMap);

  const promises = initialDishes.map(async (dish) => {
    try {
      const menuId = menuMap[dish.menu];

      if (menuId) {
        const createdDish = await dishes.create({
          title: dish.title,
          description: dish.description,
          price: dish.price,
          menu: menuId,
          type: dish.type,
          image: dish.image
        });
        dishMap[createdDish.title] = createdDish._id;
      } else {
        console.error(`Menu not found for dish: ${dish.title}`);
      }
    } catch (error) {
      console.error(`Error while creating dish ${dish.title}: ${error}`);
    }
  });

  await Promise.all(promises);
}

async function createUsers() {
  try {
    const initialUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password1',
        cellphone: '1234567890',
        roles: {
          User: 4000,
        },
      },
      {
        firstName: "JohnUser",
        lastName: "Doe",
        email: "john@user.com",
        password: "classified123",
        cellphone: "(19)9999999999",
        roles: {
          User: 4000,
        },
      },
      {
        firstName: "JohnEmployee",
        lastName: "Doe",
        email: "john@employee.com",
        password: "classified321",
        cellphone: "(19)9999999999",
        roles: {
          User: 4000,
          Employee: 3000,
        },
      },
    ];

    const userIds = [];

    for (const user of initialUsers) {
      const createdUser = await users.create(user);
      userIds.push(createdUser._id);
      userMap[user.email] = createdUser._id;
    }

    return userIds;
  } catch (error) {
    console.error(error);
  }
};

async function createUserAddresses(userMap) {
  try {
    const initialUserAddresses = [
      {
        userId: userMap['john@user.com'],
        city: 'City 1',
        state: 'State 1',
        neighborhood: 'Neighborhood 1',
        street: 'Street 1',
        number: 123,
        zipcode: '12345',
        additionalInfo: 'Additional Info 1',
        mainAddress: true,
        statusActive: true
      },
      {
        userId: userMap['john.doe@example.com'],
        city: 'City 2',
        state: 'State 2',
        neighborhood: 'Neighborhood 2',
        street: 'Street 2',
        number: 456,
        zipcode: '54321',
        additionalInfo: 'Additional Info 2',
        mainAddress: true,
        statusActive: true
      },
      {
        userId: userMap['john@employee.com'],
        city: 'City 3',
        state: 'State 3',
        neighborhood: 'Neighborhood 3',
        street: 'Street 3',
        number: 456,
        zipcode: '54321',
        additionalInfo: 'Additional Info 3',
        mainAddress: true,
        statusActive: true
      },
    ];
    for (const address of initialUserAddresses) {
      const createdAddress = await addresses.create(address);
      addressMap[address.userId] = createdAddress._id;
      const user = await users.findById(address.userId);
      user.addresses.push(createdAddress._id);
      await user.save();
    }
    return addressMap;
  } catch (error) {
    console.error(error);
  }
};

async function createPaymentMethods() {
  try {
    const initialPaymentMethods = [
      {
        name: "Dinheiro"
      },
      {
        name: "PIX à vista"
      },
      {
        name: "Cartão de Crédito"
      },
      {
        name: "Cartão de Débito"
      },
      {
        name: "Vale Alimentação"
      },
      {
        name: "Vale Refeição"
      },
    ];

    const paymentMethodIds = [];

    for (const paymentMethod of initialPaymentMethods) {
      const createdPaymentMethod = await paymentMethods.create(paymentMethod);
      paymentMethodIds.push(createdPaymentMethod._id);
      paymentMap[createdPaymentMethod.name] = createdPaymentMethod._id;
      console.log(`Payment method created with ID: ${createdPaymentMethod._id}`);
    }
    return paymentMethodIds;
  } catch (error) {
    console.error(error);
  }
};

async function createOrderStatus() {
  try {
    const initialOrderStatus = [
      {
        status: "Pendente",
      },
      {
        status: "Iniciando Preparo do Pedido",
      },
      {
        status: "Pedido Pronto",
      },
      {
        status: "Delivery a caminho",
      },
      {
        status: "Completo",
      },
      {
        status: "Cancelado",
      },
    ];

    const orderStatusIds = [];

    for (const orderStatuses of initialOrderStatus) {
      const createdOrderStatus = await orderStatus.create(orderStatuses);
      orderStatusIds.push(createdOrderStatus._id);
      orderStatusMap[createdOrderStatus.status] = createdOrderStatus._id;
      console.log(`Order status created with ID: ${createdOrderStatus._id}`);
    }

    return orderStatusIds;
  } catch (error) {
    console.error(error);
  }
};

async function createOrders() {
  try {
    const initialOrders = [];
    const orderStatuses = Object.keys(orderStatusMap);

    for (const userEmail in userMap) {
      const userId = userMap[userEmail];
      const addressId = addressMap[userId];
      const paymentMethodId = getRandomPaymentMethodId();

      for (let i = 0; i < 6; i++) {
        const orderStatusId = orderStatusMap[orderStatuses[i % orderStatuses.length]];
        const order = {
          userId,
          deliveryAddress: addressId,
          cartItems: [],
          status: orderStatusId,
          totalAmount: 100,
          paymentMethod: paymentMethodId,
          dateOrdered: new Date(),
        };
        initialOrders.push(order);
      }
    }

    const orderIds = [];

    for (const order of initialOrders) {
      const createdOrder = await orders.create(order);
      orderIds.push(createdOrder._id);
      console.log(`Order created with ID: ${createdOrder._id}`);

      const orderItems = await createOrderItems(createdOrder._id, order.userId);
      if (Array.isArray(orderItems)) {
        await updateCartItems(createdOrder._id, orderItems);
        for (const orderItem of orderItems) {
          orderItemMap.set(orderItem, createdOrder._id);
        }
      } else {
        console.error(`Error: cartItems for order with ID ${createdOrder._id} is not an array.`);
      }
    }
    return orderIds;
  } catch (error) {
    console.error(error);
  }
}

async function createOrderItems(orderId, userId) {
  try {
    const initialOrderItems = [];
    for (let i = 0; i < 5; i++) {
      const dishId = getRandomDishId();
      const quantity = getRandomQuantity();
      const orderItem = {
        userId,
        orderId,
        dishId,
        quantity,
      };
      initialOrderItems.push(orderItem);
    }

    const orderItemIds = [];

    for (const orderItem of initialOrderItems) {
      const createdOrderItem = await orderItems.create(orderItem);
      orderItemIds.push(createdOrderItem._id);
      console.log(`Order item created with ID: ${createdOrderItem._id}`);
    }

    return initialOrderItems; // Return the initial order items instead of just the IDs
  } catch (error) {
    console.error(error);
  }
}


async function updateCartItems(orderId, orderItemIds) {
  try {
    await orders.updateOne(
      { _id: orderId },
      { $push: { cartItems: { $each: orderItemIds } } }
    );
  } catch (error) {
    console.error(`Error while updating cart items for order with ID: ${orderId}`);
  }
}
/* FUNCTIONS TO RANDOMIZE */

function getRandomDishId() {
  const dishTitles = Object.keys(dishMap);
  const randomIndex = Math.floor(Math.random() * dishTitles.length);
  const randomDishTitle = dishTitles[randomIndex];
  return dishMap[randomDishTitle];
}

function getRandomQuantity() {
  return Math.floor(Math.random() * 5) + 1;
}

function getRandomPaymentMethodId() {
  const paymentNames = Object.keys(paymentMap);
  const randomIndex = Math.floor(Math.random() * paymentNames.length);
  const randomPaymentName = paymentNames[randomIndex];
  return paymentMap[randomPaymentName];
}


/* CALL ALL FUNCTIONS */

export async function initializeData() {
  try {
    const menuCount = await menus.countDocuments();
    const dishCount = await dishes.countDocuments();
    const userCount = await users.countDocuments();
    const paymentCount = await paymentMethods.countDocuments();
    const orderStatusCount = await orderStatus.countDocuments();
    const orderCount = await orders.countDocuments();

    if (menuCount === 0) {
      const createdMenus = await createMenus();
      console.log(`Created menus.`);
    }

    if (dishCount === 0) {
      const createdDishes = await createDishes(menuMap);
      console.log(`Created dishes.`);
    }

    console.log('User Count:', userCount);

    if (userCount < 4) {
      const userIds = await createUsers();
      const addressMap = await createUserAddresses(userMap);
      console.log(`Created users.`);
      console.log('User Addresses:', addressMap);
    }

    if (paymentCount === 0) {
      const createdPaymentMethods = await createPaymentMethods();
      console.log(`Created payment methods.`);
    }

    if (orderStatusCount === 0) {
      const createdOrderStatus = await createOrderStatus();
      console.log(`Created  order statuses.`);
    }

    if (orderCount < 20) {
      const allCreatedOrderIds = await createOrders();
      console.log(`Created orders.`);
      console.log('Order Items:', orderItemMap);
    }

  } catch (error) {
    console.error(`Error while initializing data: ${error}`);
  }
}