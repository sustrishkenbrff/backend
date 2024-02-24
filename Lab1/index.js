import express from 'express';
import bodyParser from 'body-parser';
import { USERS, ORDERS } from './db.js';
import { authorizationMiddleware } from './middlewares.js';

const app = express();

app.use(bodyParser.json());

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */
app.post('/users', (req, res) => {
 const { body } = req;

 console.log(`body`, JSON.stringify(body));

 const isUserExist = USERS.some(el => el.login === body.login);
 if (isUserExist) {
  return res.status(400).send({ message: `user with login ${body.login} already exists` });
 }

 USERS.push(body);

 res.status(200).send({ message: 'User was created' });
});
app.get('/address/from/last-5', authorizationMiddleware, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(400).send({ message: `User was not found by token: ${req.headers.authorization}` });
  }

  const userOrders = ORDERS.filter(el => el.login === user.login);

  const uniqueFromAddresses = Array.from(
    new Set(userOrders.slice(-5).map(order => order.from))
  );

  res.status(200).send(uniqueFromAddresses.reverse());
});
app.get('/address/to/last-3', authorizationMiddleware, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(400).send({ message: `User was not found by token: ${req.headers.authorization}` });
  }

  const userOrders = ORDERS.filter(el => el.login === user.login);

  const uniqueToAddresses = Array.from(
    new Set(userOrders.slice(-3).map(order => order.to))
  );

  const last3UniqueToAddresses = [...new Set(uniqueToAddresses)].slice(-3).reverse();

  res.status(200).send(last3UniqueToAddresses);
});

app.get('/orders/lowest', authorizationMiddleware, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(400).send({ message: `User was not found by token: ${req.headers.authorization}` });
  }

  const userOrders = ORDERS.filter(el => el.login === user.login);
  if (userOrders.length === 0 ) {
    return res.status(404).send({message: 'User do not have orders yet'})
  }

  const lowest = Math.min(...userOrders.map( order => order.price));

  const LowestOrder = userOrders.find(order => order.price === lowest);


  const lowestresponse = {
    order: {
      from: LowestOrder.from,
      to: LowestOrder.to,
      price: LowestOrder.price,
      login: LowestOrder.login
    }
  }

  res.status(200).send(lowestresponse);
});

app.get('/orders/biggest', authorizationMiddleware, (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(400).send({ message: `User was not found by token: ${req.headers.authorization}` });
  }

  const userOrders = ORDERS.filter(el => el.login === user.login);
  if (userOrders.length === 0 ) {
    return res.status(404).send({message: 'User do not have orders yet'})
  }

  const biggest = Math.max(...userOrders.map( order => order.price));

  const BiggestOrder = userOrders.find(order => order.price === biggest);


  const Biggestresponse = {
    order: {
      from: BiggestOrder.from,
      to: BiggestOrder.to,
      price: BiggestOrder.price,
      login: BiggestOrder.login
    }
  }

  res.status(200).send(Biggestresponse);
});


app.get('/users', (req, res) => {
 const users = USERS.map(user => {
  const { password, ...other } = user;
  return other;
 });
 return res
  .status(200)
  .send(users);
});

app.post('/login', (req, res) => {
 const { body } = req;

 const user = USERS
  .find(el => el.login === body.login && el.password === body.password);

 if (!user) {
  return res.status(400).send({ message: 'User was not found' });
 }

 const token = crypto.randomUUID();

 user.token = token;
 USERS.save(user.login, { token });

 return res.status(200).send({
  token,
  message: 'User was login'
 });
});

app.post('/orders', authorizationMiddleware, (req, res) => {
 const { body, user } = req;

 const order = {
  ...body,
  login: user.login,
  price: Math.floor(Math.random() * (81)) + 20
 };

 ORDERS.push(order);

 return res.status(200).send({ message: 'Order was created', order });
});

app.get('/orders', authorizationMiddleware, (req, res) => {
 const { user } = req;

 const orders = ORDERS.filter(el => el.login === user.login);

 return res.status(200).send(orders);
});

app.listen(8080, () => console.log('Server was started'));