import { Request, Response } from "express";
import type { Product } from "../__tests__/e2e/e2e-types";
import path from "path";
import { readdir, readFile } from "fs/promises";
import config from "../config";

const { products } = config;

export const getProducts = async (req: Request, res: Response) => {
  try {
    const fileArr: Product[] = [];
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
};

export const getProduct = async (req: Request, res: Response) => {
  const paramsId = req.params.id;

  try {
    const fileArr: Product[] = [];
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
  } catch (error) {
    console.error(error);
  }
};
