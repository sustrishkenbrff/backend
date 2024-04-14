import {
  orders,
  Order,
  GetOrdersSearchItemsCountNegativeError,
  GetOrdersSearchNoConditionError,
  GetOrdersSearchQueryError,
  GetOrdersSearchTotalPriceArgIsNegativeError,
  GetOrdersSearchTotalPriceFormatError,
  OrdersQuery,
} from './shared/orders.models';

export const getTotalPrice = (items: Order['items']) => {
  return items.reduce((acc, cur) => {
    return acc + cur.pricePerUnit * cur.quantity;
  }, 0);
};
export const getOrdersByQuery = (query: OrdersQuery): Order[] => {
  const { search, userIds = [], itemsCount, totalPrice } = query;

  const conditions: ((Order) => boolean)[] = [];

  if (search) {
    if (search.length < 3) {
      throw new GetOrdersSearchQueryError(
        'search parameter should be more than 3',
      );
    }

    conditions.push((elem: Order): boolean => {
      const searchRegExp = new RegExp(search);
      return (
        searchRegExp.test(elem.title) ||
        elem.items.some((item) => searchRegExp.test(item.title))
      );
    });
  }

  if (userIds.length) {
    conditions.push((elem: Order): boolean => {
      return userIds.includes(elem.userId);
    });
  }

  if (itemsCount != null) {
    if (itemsCount < 0) {
      throw new GetOrdersSearchItemsCountNegativeError();
    }

    conditions.push((elem: Order): boolean => elem.items.length === itemsCount);
  }

  if (totalPrice) {
    const { eq, gt, lt } = totalPrice;

    if (eq && (gt || lt)) {
      throw new GetOrdersSearchTotalPriceFormatError();
    }

    if (eq) {
      if (eq < 0) {
        throw new GetOrdersSearchTotalPriceArgIsNegativeError('eq');
      }
      conditions.push((elem: Order): boolean => {
        const totalPrice = getTotalPrice(elem.items);

        return totalPrice === eq;
      });
    } else {
      if (lt < 0) {
        throw new GetOrdersSearchTotalPriceArgIsNegativeError('lt');
      }
      if (gt < 0) {
        throw new GetOrdersSearchTotalPriceArgIsNegativeError('gt');
      }
      conditions.push((elem: Order): boolean => {
        const totalPrice = getTotalPrice(elem.items);

        return (gt ? gt < totalPrice : true) && (lt ? lt > totalPrice : true);
      });
    }
  }

  if (!conditions.length) {
    throw new GetOrdersSearchNoConditionError();
  }

  return orders.filter((order) => conditions.some((check) => check(order)));
};
