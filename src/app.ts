import express, { Request, Response } from "express";
import path from "path";
import config from "./config";
const { products, carts } = config;
import { readdir, readFile } from "fs/promises";

const app = express();

// Some nice middleware :)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
let counter = 1;
app.get("/api/products/", async (req: Request, res: Response) => {
  try {
    let fileArr = [];
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
    let fileArr = [];
    const files = await readdir(products.db);
    for (const file of files) {
      const filePath = path.join(products.db, file);
      const fileContent = await readFile(filePath, "utf-8");

      fileArr.push(JSON.parse(fileContent));
    }

    const product = fileArr.filter((product) => product.id === paramsId)

    res.json(product);
  } catch (err) {
    console.error(err);
  }
});
// Add your own middlware here!

export default app;
