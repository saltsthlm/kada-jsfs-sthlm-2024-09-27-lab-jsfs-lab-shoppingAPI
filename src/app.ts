import path from "path";
import express, { Request, Response } from "express";
import { productsRouter } from "./routes/products-roter";
import { cartsRouter } from "./routes/carts-router";
import { logger } from "./middleware/logger";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(logger);

app.use("/api/products/", productsRouter);

app.use("/api/carts/", cartsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
