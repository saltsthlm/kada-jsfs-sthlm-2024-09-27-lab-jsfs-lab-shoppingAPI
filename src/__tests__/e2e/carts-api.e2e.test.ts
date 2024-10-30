/* eslint no-restricted-syntax: 0 */
import assert from "assert";
import request from "supertest";
import { readdir, unlink } from "fs";
import { join } from "path";
import http from "http";
import app from "../../app";
import { Cart, Product } from "./e2e-types";

describe("The Carts API", () => {
  let server: http.Server;

  function cleanCartsDb() {
    const directory = `${__dirname}/../../db/test/carts`;
    readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(join(directory, file), (e) => {
          if (e) throw e;
        });
      }
    });
  }
  beforeEach(() => {
    cleanCartsDb();
    server = http.createServer(app);
    server.listen(0);
  });

  afterEach((done) => {
    server.close(done);
  });

  test("create new cart", async () => {
    const resp = await request(server).post("/api/carts").expect(201);

    const {
      text,
      headers: { location },
    } = resp;
    const { id }: Cart = JSON.parse(text);
    assert(/[\da-h]{8}(-[\da-h]{4}){3}-[\da-h]{12}/.test(id));
    assert.equal(location, `/api/carts/${id}`);
  });

  test("reject invalid content type", async () => {
    const resp = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(resp.text);

    await request(server).patch(`/api/carts/${id}`).expect(400);
  });

  test("create -> add item as json -> get content", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(r0.text);

    const product: Product = {
      id: "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      item: "Keychain Phone Charger",
      quantity: 3,
      price: 10.53,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(product)
      .expect(204);

    const r2 = await request(server).get(`/api/carts/${id}`).expect(200);

    const { products }: Cart = JSON.parse(r2.text);

    assert.deepEqual(products[0], product);
  });

  test("create -> add item as html form -> get content", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(r0.text);

    const product: Product = {
      id: "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      item: "Keychain Phone Charger",
      quantity: 3,
      price: 10.53,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(
        `id=${product.id}&item=${product.item}&quantity=${product.quantity}&price=${product.price}`,
      )
      .expect(204);

    const r2 = await request(server).get(`/api/carts/${id}`).expect(200);

    const { products }: Cart = JSON.parse(r2.text);

    assert.deepEqual(products[0], product);
  });

  test("create -> get -> delete -> get -> delete", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(r0.text);

    await request(server).get(`/api/carts/${id}`).expect(200);
    await request(server).delete(`/api/carts/${id}`).expect(204);
    await request(server).get(`/api/carts/${id}`).expect(404);
    await request(server).delete(`/api/carts/${id}`).expect(204);
  });

  test("add many items", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(r0.text);

    const product1: Product = {
      id: "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      item: "Keychain Phone Charger",
      quantity: 3,
      price: 10.53,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(product1)
      .expect(204);

    const product2: Product = {
      id: "39ac2118-7531-11e8-86e5-f0d5bf731f68",
      item: "Coffee Mug",
      quantity: 1,
      price: 1.0,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(product2)
      .expect(204);

    const product3: Product = {
      id: product1.id,
      quantity: 1,
      item: product1.item,
      price: product1.price,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(product3)
      .expect(204);

    const r4 = await request(server).get(`/api/carts/${id}`).expect(200);

    const { products }: Cart = JSON.parse(r4.text);

    assert.equal(products.length, 2);

    const [{ quantity, price }] = products.filter((p) => p.id === product1.id);
    assert.equal(quantity, product1.quantity + product3.quantity);

    const expPrice =
      product1.quantity * product1.price + product3.quantity * product3.price;
    assert.equal(price * quantity, expPrice);
  });

  test("add item and validate price", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id }: Cart = JSON.parse(r0.text);

    const productWithStrangePrice: Product = {
      id: "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      item: "Keychain Phone Charger",
      quantity: 3,
      price: -10.2,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(productWithStrangePrice)
      .expect(400);
  });

  test("add item and validate quantity", async () => {
    const r0 = await request(server).post("/api/carts").expect(201);

    const { id } = JSON.parse(r0.text);

    const productWithStrangeQuantity = {
      id: "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      item: "Keychain Phone Charger",
      quantity: -132,
      price: 10.5,
    };

    await request(server)
      .patch(`/api/carts/${id}`)
      .set("Content-Type", "application/json")
      .send(productWithStrangeQuantity)
      .expect(400);
  });
});
