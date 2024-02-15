# Task

## 1

Create API for returning last 5 unique address for "from" point. In orders new order will be pushed in the end of array.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

```
GET http://localhost:8080/address/from/last-5
headers: { authorization: <user token> }
```

Response structure
```
string[]
```

In the case if db orders will be have next docs:
```
[
 { from: "address-1", to: "address-2", login: "user-1" },
 { from: "address-2", to: "address-3", login: "user-1" },
 { from: "address-3", to: "address-4", login: "user-1" },
 { from: "address-3", to: "address-5", login: "user-1" },
 { from: "address-5", to: "address-2", login: "user-1" },
 { from: "address-4", to: "address-1", login: "user-1" },
 { from: "address-2", to: "address-1", login: "user-1" },
]
```

Response example
```
[
 "address-4",
 "address-5",
 "address-3",
 "address-2",
 "address-1",
]
```

## 2

Create API for returning last 3 unique address for "to" point. In orders new order will be pushed in the end of array.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

```
GET http://localhost:8080/address/to/last-3
headers: { authorization: <user token> }
```

Response structure
```
string[]
```

In the case if db orders will be have next docs:
```
[
 { from: "address-1", to: "address-2", login: "user-1" },
 { from: "address-2", to: "address-3", login: "user-1" },
 { from: "address-3", to: "address-4", login: "user-1" },
 { from: "address-3", to: "address-5", login: "user-1" },
 { from: "address-5", to: "address-2", login: "user-1" },
 { from: "address-4", to: "address-1", login: "user-1" },
 { from: "address-2", to: "address-1", login: "user-1" },
]
```

Response example
```
[
 "address-1",
 "address-2",
 "address-5",
]
```

## 3

Update API for creating orders. We need to add field price, and price will be random value from 20 to 100.

```
POST http://localhost:8080/orders
headers: { authorization: <user token> }
body: { "from": string, "to": string }
```

Response example
```
{
 message: 'Order was created',
 order: {
  login,
  from,
  to,
  price
 }
}
```

## 4

Create API forto get lowest order by price.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

In the case when user do not have any orders
* return message: "User do not have orders yet"
* return status code: 404

```
GET http://localhost:8080/orders/lowest
headers: { authorization: <user token> }
```

Response example
```
{
  login: string,
  from: string,
  to: string,
  price: number
}
```

## 5

Create API forto get biggest order by price 

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

In the case when user do not have any orders
* return message: "User do not have orders yet"
* return status code: 404

```
GET http://localhost:8080/orders/biggest
headers: { authorization: <user token> }
```

Response example
```
{
  login: string,
  from: string,
  to: string,
  price: number
}
```
