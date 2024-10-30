// this file contains types that we are using in our e2e test
// it should not be shared in the API, since we don't want our
// clients to use our internal models

export type Product = {
  id: string,
  item: string,
  price: number,
  quantity: number,
  description?: string,
};

export type Cart = {
  id: string,
  products : Product[]
};
