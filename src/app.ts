import express, { Request, Response } from "express";
import path from "path";
import config from "./config";
const { products, carts } = config;
import { readdir, readFile, writeFile, appendFile } from "fs/promises";
import type { Cart, Product } from "./__tests__/e2e/e2e-types";
import { v4 as uuidv4 } from "uuid";
import { validate } from "./cart/api/validation";

const app = express();

// Some nice middleware :)
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
  const product = validate(req.body);

  if (!product.success) {
    res.status(400).json({ error: "Invalid request" });
  } else {
    const cartPath = path.join(carts.db, req.params.id);

    const products = JSON.parse(await readFile(cartPath, "utf-8")) as Product[];
    products.push(product.data);
    await writeFile(cartPath, JSON.stringify(products), "utf8");

    res.status(204).json("Added product to cart: " + product.data.id);
  }
});

app.get("/api/carts/:id", async (req: Request, res: Response) => {
  try {
    const filePath = path.join(carts.db, req.params.id);
    const products = JSON.parse(await readFile(filePath, "utf-8")) as Product[];

    const cart: Cart = {
      id: req.params.id,
      products,
    };

    res.json(cart);
  } catch (err) {
    console.error(err);
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Add your own middlware here!

export default app;
