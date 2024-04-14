import { getTotalPrice, getOrdersByQuery } from './orders';
import { Order, OrdersQuery, GetOrdersSearchQueryError, GetOrdersSearchTotalPriceFormatError, GetOrdersSearchItemsCountNegativeError, GetOrdersSearchNoConditionError  } from './shared/orders.models';

describe('getTotalPrice', () => {
  it('total price', () => {
    const items: Order['items'] = [
      { title: 'Item 1', pricePerUnit: 10, quantity: 2 },
      { title: 'Item 2', pricePerUnit: 20, quantity: 1 },
    ];
    const totalPrice = getTotalPrice(items);
    expect(totalPrice).toBe(40); 
  });
});

describe('getOrdersByQuery', () => {
  it(' filter orders by search query', () => {
    const query: OrdersQuery = { search: 'et' };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchQueryError);
  });

  it(' filter orders by userIds', () => {
    const query: OrdersQuery = { userIds: ['A8A9861E-5E73-9F6C-9A47-D3F98C682B5D'] };
    const filteredOrders = getOrdersByQuery(query);
    expect(filteredOrders).toHaveLength(1);
    expect(filteredOrders[0].userId).toBe('A8A9861E-5E73-9F6C-9A47-D3F98C682B5D');
  });

  it(' filter orders by item quantity', () => {
    const query: OrdersQuery = { itemsCount: 3 };
    const filteredOrders = getOrdersByQuery(query);
    expect(filteredOrders.every(order => order.items.length >= 3)).toBe(true);
  });

  it(' filter orders by total items count', () => {
    const query: OrdersQuery = { itemsCount: 20 }; 
    const filteredOrders = getOrdersByQuery(query);
    expect(filteredOrders.every(order => order.items.reduce((total, item) => total + item.quantity, 0) >= 20)).toBe(true);
  });
  
  it(' filter orders by item price', () => {
    const query: OrdersQuery = { totalPrice: { gt: 100, lt: 500, eq: 0 } };
    const filteredOrders = getOrdersByQuery(query);
    expect(filteredOrders.every(order => {
      const totalPrice = order.items.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
      return totalPrice > 100 && totalPrice < 500;
    })).toBe(true);
  });
  

  it(' filter orders by total price range', () => {
    const query: OrdersQuery = { totalPrice: { gt: 100, lt: 500, eq: 200 } };
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceFormatError);
  });

  it(' throw GetOrdersSearchQueryError when search query is invalid', () => {
    const query: OrdersQuery = { search: 'et' }; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchQueryError);
  });

  it(' throw GetOrdersSearchNoConditionError when no conditions are provided', () => {
    const query: OrdersQuery = {}; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchNoConditionError);
  });

  it(' throw GetOrdersSearchItemsCountNegativeError when items count is negative', () => {
    const query: OrdersQuery = { itemsCount: -1 }; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchItemsCountNegativeError);
  });

  
  it(' throw GetOrdersSearchTotalPriceFormatError when total price format is invalid', () => {
    const query: OrdersQuery = { totalPrice: { gt: 100, lt: 500, eq: 200 } }; 
    expect(() => getOrdersByQuery(query)).toThrow(GetOrdersSearchTotalPriceFormatError);
  });
  
  

});
