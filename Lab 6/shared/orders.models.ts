export class GetOrdersSearchQueryError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class GetOrdersSearchNoConditionError extends Error {
  constructor() {
    super('no conditions was found');
  }
}
export class GetOrdersSearchItemsCountNegativeError extends Error {
  constructor() {
    super('items count is negative');
  }
}

export class GetOrdersSearchTotalPriceFormatError extends Error {
  constructor() {
    super('totalPrice has wrong format');
  }
}

export class GetOrdersSearchTotalPriceArgIsNegativeError extends Error {
  constructor(arg: string) {
    super(`${arg} is negative`);
  }
}
export interface OrdersQuery {
  search?: string;
  userIds?: string[];
  itemsCount?: number;
  totalPrice?: {
    gt: number;
    lt: number;
    eq: number;
  };
}

export interface Order {
  title: string;
  userId: string;
  date: string;
  items: { title: string; pricePerUnit: number; quantity: number }[];
}

export const orders: Order[] = [
  {
    userId: 'A8A9861E-5E73-9F6C-9A47-D3F98C682B5D',
    date: 'Oct 28, 2023',
    title: 'et',
    items: [
      {
        title: 'magna. Suspendisse tristique neque venenatis lacus.',
        pricePerUnit: 176,
        quantity: 3,
      },
      {
        title: 'in faucibus orci luctus et',
        pricePerUnit: 285,
        quantity: 8,
      },
      {
        title: 'quis diam. Pellentesque habitant morbi tristique senectus',
        pricePerUnit: 19,
        quantity: 8,
      },
      {
        title: 'non magna. Nam ligula elit, pretium',
        pricePerUnit: 57,
        quantity: 9,
      },
      {
        title: 'condimentum. Donec at arcu.',
        pricePerUnit: 148,
        quantity: 6,
      },
    ],
  },
  {
    userId: '9EDE726B-436E-07EA-528E-61C27AC579B0',
    date: 'Dec 2, 2023',
    title: 'varius et, euismod',
    items: [
      {
        title: 'est. Nunc laoreet lectus quis massa. Mauris',
        pricePerUnit: 87,
        quantity: 7,
      },
      {
        title: 'in, hendrerit consectetuer, cursus et,',
        pricePerUnit: 60,
        quantity: 10,
      },
      {
        title: 'accumsan neque et nunc. Quisque ornare tortor',
        pricePerUnit: 199,
        quantity: 6,
      },
      {
        title: 'natoque penatibus et magnis dis',
        pricePerUnit: 213,
        quantity: 8,
      },
      {
        title: 'fringilla euismod enim. Etiam gravida molestie',
        pricePerUnit: 163,
        quantity: 4,
      },
    ],
  },
  {
    userId: '35C1DF83-9DDC-75EA-8AC9-4A87E9421D17',
    date: 'Jul 4, 2024',
    title: 'nisi. Cum',
    items: [
      {
        title: 'adipiscing lobortis risus. In mi',
        pricePerUnit: 294,
        quantity: 9,
      },
      {
        title: 'Donec tempor, est ac mattis semper, dui',
        pricePerUnit: 73,
        quantity: 5,
      },
      {
        title: 'sociis natoque penatibus et magnis dis parturient',
        pricePerUnit: 288,
        quantity: 5,
      },
      {
        title: 'Suspendisse eleifend. Cras sed leo.',
        pricePerUnit: 248,
        quantity: 4,
      },
      {
        title: 'odio. Aliquam vulputate ullamcorper magna. Sed eu',
        pricePerUnit: 170,
        quantity: 7,
      },
    ],
  },
  {
    userId: 'D32F813D-95D4-AAC4-546D-926B46FC961A',
    date: 'Mar 18, 2025',
    title: 'faucibus leo, in',
    items: [
      {
        title: 'sed sem egestas blandit. Nam nulla magna, malesuada',
        pricePerUnit: 136,
        quantity: 2,
      },
      {
        title: 'nunc. Quisque ornare tortor at',
        pricePerUnit: 203,
        quantity: 6,
      },
      {
        title: 'nulla. Cras eu tellus eu augue porttitor interdum.',
        pricePerUnit: 13,
        quantity: 3,
      },
      {
        title: 'egestas a, dui. Cras pellentesque. Sed dictum.',
        pricePerUnit: 98,
        quantity: 2,
      },
      {
        title: 'imperdiet nec, leo. Morbi neque tellus,',
        pricePerUnit: 253,
        quantity: 6,
      },
    ],
  },
  {
    userId: '68A67258-2C8B-8962-5A72-4761DC027196',
    date: 'Sep 21, 2023',
    title: 'nunc',
    items: [
      {
        title: 'facilisis lorem tristique aliquet. Phasellus',
        pricePerUnit: 100,
        quantity: 6,
      },
      {
        title: 'rutrum non, hendrerit id, ante. Nunc mauris',
        pricePerUnit: 15,
        quantity: 9,
      },
      {
        title: 'sit amet, dapibus id, blandit at, nisi.',
        pricePerUnit: 108,
        quantity: 3,
      },
      {
        title: 'molestie arcu. Sed eu nibh',
        pricePerUnit: 63,
        quantity: 2,
      },
      {
        title: 'egestas ligula. Nullam feugiat placerat',
        pricePerUnit: 229,
        quantity: 5,
      },
    ],
  },
];
