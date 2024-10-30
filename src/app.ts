import express, { Request, Response } from "express";
import path from "path";
import config from "./config";
const { products, carts } = config;
import { readdir, readFile } from "fs/promises";
import type { Cart, Product } from "./__tests__/e2e/e2e-types";
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Some nice middleware :)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products/", async (req: Request, res: Response) => {
  try {
    let fileArr:Product[] = [];
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
    let fileArr:Product[] = [];
    const files = await readdir(products.db);
    for (const file of files) {
      const filePath = path.join(products.db, file);
      const fileContent = await readFile(filePath, "utf-8");

      fileArr.push(JSON.parse(fileContent));
    }

    const product = fileArr.find((product) => product.id === paramsId)
    if(typeof product === 'undefined') {
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
        products: []
    };

    res.status(201).location(`/api/carts/${id}`).json(cart);
});

app.use((req: Request, res: Response) => {
    res.status(404).json({error: "Not found"});
})


// Add your own middlware here!

export default app;
