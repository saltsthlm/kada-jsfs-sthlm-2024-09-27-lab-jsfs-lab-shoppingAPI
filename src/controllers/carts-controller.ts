import { Request, Response } from "express";
import type { Cart, Product } from "../__tests__/e2e/e2e-types";
import path from "path";
import { readFile, unlink, writeFile } from "fs/promises";
import config from "../config";
import { v4 as uuidv4 } from "uuid";
import { validate } from "../cart/api/validation";
import { existsSync } from "fs";

const { carts } = config;

export const addToCart = (async (req: Request,  res: Response) => {
  const id = uuidv4 ();

  const cart: Cart = {
    id,
    products: [],
  };
   try {
    writeFile(path.join(carts.db, id), JSON.stringify(cart.products));

    res.status(201).location(`/api/carts/${id}`).json(cart);
   } catch (error) {
      console.log(error);
   }  
});

export const updateCart = (async (req: Request,  res: Response) => {
  if (!req.body) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  const product = validate({
    ...req.body,
    quantity: Number(req.body.quantity),
    price: Number(req.body.price),
  });

  if (!product.success || product.data.price < 0 || product.data.quantity < 0) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const cartPath = path.join(carts.db, req.params.id);

  if (!existsSync(cartPath)) {
    res.status(400).json("Bad Request");
    return;
  }

  try {
    let products = JSON.parse(await readFile(cartPath, "utf-8")) as Product[];

    if (products.find((el) => el.id === product.data.id)) {
      products = products.map((cartProduct) => {
        if (cartProduct.id === product.data.id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + product.data.quantity,
          };
        }
        return cartProduct;
      });
    } else {
      products.push(product.data);
    }

    await writeFile(cartPath, JSON.stringify(products), "utf8");

    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const getCart = (async (req: Request,  res: Response) => {
  try {
    const filePath = path.join(carts.db, req.params.id);
    if (!existsSync(filePath)) {
      res.status(404).json("This cart doesn't exist");
    } else {
      const products = JSON.parse(
        await readFile(filePath, "utf-8"),
      ) as Product[];

      const cart: Cart = {
        id: req.params.id,
        products,
      };

      res.json(cart);
    }
  } catch (err) {
    console.error(err);
  }
});

export const deleteCart = (async (req: Request,  res: Response) => {
  const cartPath = path.join(carts.db, req.params.id);

  if (existsSync(cartPath)) {
    await unlink(cartPath);
    res.status(204).json();
  } else {
    res.status(204).json("Cart doesn't exists");
  }
});
