import express, { Request, Response } from "express";
import path from "path";
import config from "./config";
import { readdir, readFile, writeFile, unlink } from "fs/promises";
import type { Cart, Product } from "./__tests__/e2e/e2e-types";
import { v4 as uuidv4 } from "uuid";
import { validate } from "./cart/api/validation";
import { existsSync } from "fs";

const { products, carts } = config;
const app = express();

// Some nice middleware :)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products/", async (req: Request, res: Response) => {
  try {
    let fileArr: Product[] = [];
    const files = await readdir(products.db);
    for (const file of files) {
      const filePath = path.join(products.db, file);
      const fileContent = await readFile(filePath, "utf-8");

      fileArr.push(JSON.parse(fileContent));
    }

    res.json(fileArr);
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  const paramsId = req.params.id;
  console.log(paramsId);

  try {
    let fileArr: Product[] = [];
    const files = await readdir(products.db);
    for (const file of files) {
      const filePath = path.join(products.db, file);
      const fileContent = await readFile(filePath, "utf-8");

      fileArr.push(JSON.parse(fileContent));
    }

    const product = fileArr.find((product) => product.id === paramsId);
    if (typeof product === "undefined") {
      res.status(404).json("No product with this id: " + paramsId);
    }
    res.json(product);
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/carts/", (req: Request, res: Response) => {
  const id = uuidv4();

  const cart: Cart = {
    id,
    products: [],
  };

  writeFile(path.join(carts.db, id), JSON.stringify(cart.products));

  res.status(201).location(`/api/carts/${id}`).json(cart);
});

app.patch("/api/carts/:id", async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  const product = validate({
    ...req.body,
    quantity: Number(req.body.quantity),
    price: Number(req.body.price),
  });

  if (!product.success || product.data.price < 0) {
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/carts/:id", async (req: Request, res: Response) => {
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

app.delete("/api/carts/:id", async (req: Request, res: Response) => {
  const cartPath = path.join(carts.db, req.params.id);

  if (existsSync(cartPath)) {
    await unlink(cartPath);
    res.status(204).json();
  } else {
    res.status(204).json("Cart doesn't exists");
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Add your own middlware here!

export default app;
