/* eslint-disable no-console */
import fs from "fs";

const env = process.env.NODE_ENV || "development";

const dbBase = `${__dirname}/../db`;
const dbPath = `${dbBase}/${env}`;
const productsPath = `${dbPath}/products`;
const cartsPath = `${dbPath}/carts`;

async function init() {
  function mkIfNotExists(dir: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  try {
    await Promise.all([productsPath, cartsPath].map((p) => mkIfNotExists(p)));
  } catch (err) {
    console.log("WARNING", "Error while initializing environment.", err);
  }
}

init();

export = {
  carts: {
    db: cartsPath,
  },
  products: {
    db: productsPath,
  },
};
