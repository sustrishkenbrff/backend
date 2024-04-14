import express from 'express';
import crypto from 'crypto';
import { USERS } from '../db.js';

const router = express.Router();

router.post('/users', (req, res) => {
  const { body } = req;

  const newUser = {
    ...body,
    role: body.role || "Customer"
  };

  console.log(`body`, JSON.stringify(newUser));

  const isUserExist = USERS.some(el => el.login === newUser.login);
  if (isUserExist) {
    return res.status(400).send({ message: `user with login ${newUser.login} already exists` });
  }

  USERS.push(newUser);

  res.status(200).send({ message: 'User was created' });
});

router.post('/admin', (req, res) => {
  const { body, headers } = req;

  const adminpass = "admin";

  if (headers.authorization !== adminpass) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const newUser = {
    ...body,
    role: "Admin"
  };

  console.log(`body`, JSON.stringify(newUser));

  const isUserExist = USERS.some(el => el.login === newUser.login);
  if (isUserExist) {
    return res.status(400).send({ message: `user with login ${newUser.login} already exists` });
  }

  const token = crypto.randomUUID(); 

  newUser.token = token;

  USERS.push(newUser);

  res.status(200).send({ message: 'Admin user was created', user: newUser });
});

router.post('/drivers', (req, res) => {
  const { body } = req;

  const newUser = {
    ...body,
    role: "Driver"
  };

  console.log(`body`, JSON.stringify(newUser));

  const isUserExist = USERS.some(el => el.login === newUser.login);
  if (isUserExist) {
    return res.status(400).send({ message: `user with login ${newUser.login} already exists` });
  }

  const token = crypto.randomUUID();

  newUser.token = token;

  USERS.push(newUser);

  res.status(200).send({ message: 'Driver user was created', user: newUser });
});

router.get('/users', (req, res) => {
  const users = USERS.map(user => {
    const { password, ...other } = user;
    return other;
  });
  return res.status(200).send(users);
});

router.post('/login', (req, res) => {
  const { body } = req;

  const user = USERS.find(el => el.login === body.login && el.password === body.password);

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

export default router;
