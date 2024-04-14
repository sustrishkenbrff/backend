import express from 'express';
import bodyParser from 'body-parser';
import { USERS } from './db.js';
import usersRouter from './routers/users.router.js';
import { OrdersRouter } from './routers/orders.router.js';

const app = express();

app.use(bodyParser.json());

app.use(usersRouter);

app.use(OrdersRouter);

app.listen(8080, () => console.log('Server was started'));
