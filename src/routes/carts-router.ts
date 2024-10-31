import express from "express";
import { addToCart, deleteCart, getCart, updateCart } from "../controllers/carts-controller";

export const cartsRouter  = express.Router();

cartsRouter.post("/", addToCart);

cartsRouter.patch("/:id", updateCart);

cartsRouter.get("/:id", getCart );

cartsRouter.delete("/:id", deleteCart);