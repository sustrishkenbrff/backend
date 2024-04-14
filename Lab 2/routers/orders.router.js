import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ORDERS,ADDRESSES } from '../db.js';

export const OrdersRouter = Router();



const convertToDate = (date) => {
  if (!/^\d\d-\d\d-\d{4}$/.test(date)) {
    throw new Error(`parameter createdAt has wrong format`);
  }
 
  const [day, month, year] = date.split('-');

  const mothsInt = parseInt(month);
  if (mothsInt < 1 || mothsInt > 12) {
    throw new Error(`parameter createdAt has wrong month value`);
  }

  const result = new Date();
  result.setHours(2);
  result.setMinutes(0);
  result.setSeconds(0);
  result.setMilliseconds(0);

  result.setMonth(mothsInt - 1);
  result.setDate(day);
  result.setFullYear(year);

  return result;
};


const convertToDateMiddleware = (fieldName) => (req, res, next) => {
 const valueString = req.query[fieldName];

 if (!valueString) {
  return next();
 }
 try {
  const value = convertToDate(valueString);
  req.query[fieldName] = value;
  return next();
 } catch (err) {
  return res.status(400)
   .send({ message: err.toString() });
 }
};

const calculateDistance = (point1, point2) => {
  const earthRadiusKm = 6371;

  const lat1Rad = toRadians(point1.latitude);
  const lat2Rad = toRadians(point2.latitude);
  const lon1Rad = toRadians(point1.longitude);
  const lon2Rad = toRadians(point2.longitude);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;
  return distance;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

OrdersRouter.post('/orders', authorizationMiddleware, async (req, res) => {
  const { body, user } = req;

  const fromName = body.from;
  const toName = body.to;

  const fromAddress = ADDRESSES.find(address => address.name === fromName);
  const toAddress = ADDRESSES.find(address => address.name === toName);

  if (!fromAddress) {
    return res.status(400).send({ message: `Invalid 'from' address: ${fromName}` });
  }

  if (!toAddress) {
    return res.status(400).send({ message: `Invalid 'to' address: ${toName}` });
  }

  const distance = calculateDistance(fromAddress.location, toAddress.location);

  let price;
  switch (body.type) {
    case "standard":
      price = distance * 2.5;
      break;
    case "lite":
      price = distance * 1.5;
      break;
    case "universal":
      price = distance * 3;
      break;
    default:
      return res.status(400).send({ message: `Invalid order type: ${body.type}` });
  }

  const createdAt = new Date();
  createdAt.setHours(2);
  createdAt.setMinutes(0);
  createdAt.setMilliseconds(0);
  createdAt.setSeconds(0);

  const order = {
    ...body,
    login: user.login,
    createdAt,
    status: "Active",
    id: crypto.randomUUID(),
    distance: distance.toFixed(2),
    price: price.toFixed(2) 
  };

  ORDERS.push(order);

  return res.status(200).send({ message: 'Order was created', order });
});


OrdersRouter.get('/orders', authorizationMiddleware, (req, res) => {
  const { user } = req;

  let orders;

  if (user.role === "Customer") {
    orders = ORDERS.filter(el => el.login === user.login);
  }

  if (user.role === "Driver") {
    orders = ORDERS.filter(el => el.status === "Active");
  }

  if (user.role === "Admin") {
    orders = ORDERS;
  }

  return res.status(200).send(orders);
});


OrdersRouter.patch('/orders/:orderId', authorizationMiddleware, (req, res) => {
  const { params, body, user, headers } = req;

  if (user.role === "Admin" || user.role === "Driver") {
    const authToken = headers.authorization;
    if (!authToken || authToken !== user.token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  }

  const order = ORDERS.find(el => el.id === params.orderId);

  if (!order) {
    return res.status(404).send({ message: `Order with id ${params.orderId} was not found` });
  }

  switch (user.role) {
    case "Customer":
      if (order.status === "Active" && body.status === "Rejected") {
        order.status = body.status;
      } else {
        return res.status(403).send({ message: "You are not allowed to change the status of this order" });
      }
      break;
    case "Driver":
      if ((order.status === "Active" && body.status === "In progress") ||
          (order.status === "In progress" && body.status === "Done")) {
        order.status = body.status;
      } else {
        return res.status(403).send({ message: "You are not allowed to change the status of this order" });
      }
      break;
    case "Admin":
      if ((order.status === "Active" && body.status === "Rejected") ||
          (order.status === "Active" && body.status === "In progress") ||
          (order.status === "In progress" && body.status === "Done")) {
        order.status = body.status;
      } else {
        return res.status(403).send({ message: "You are not allowed to change the status of this order" });
      }
      break;
    default:
      return res.status(403).send({ message: "You are not allowed to change the status of this order" });
  }

  return res.status(200).send(order);
});
